"""
Fetch OHLCV time series from crypto exchanges using CCXT and save to CSV.
Usage: python fetch_coin_data.py --symbol BTCUSDT --days 90
"""
import argparse
import pandas as pd
import time
from utils import DATA_DIR, iso_ts
import pytz
from datetime import datetime, timedelta
import ccxt


def normalize_symbol(symbol: str, exchange_name: str) -> str:
    """
    Normalize symbol format for different exchanges.
    Some exchanges use BTC/USDT, others use BTCUSDT.
    """
    # If symbol already has /, return as is
    if '/' in symbol:
        return symbol
    
    # Try to split common patterns (e.g., BTCUSDT -> BTC/USDT)
    # Common quote currencies
    quote_currencies = ['USDT', 'USD', 'BTC', 'ETH', 'BNB', 'USDC', 'EUR', 'GBP']
    
    for quote in quote_currencies:
        if symbol.endswith(quote):
            base = symbol[:-len(quote)]
            if base:
                return f"{base}/{quote}"
    
    # If we can't parse it, return as is and let CCXT handle it
    return symbol


def fetch_klines(symbol: str, interval: str = "1d", limit: int = 30, exchange_name: str = "coinbasepro"):
    """
    Fetch klines (candlestick) data from crypto exchange using CCXT.
    Uses fallback exchanges if the primary exchange fails.
    
    Args:
        symbol: Trading pair symbol (e.g., 'BTCUSDT' or 'BTC/USDT')
        interval: Timeframe interval (e.g., '1m', '5m', '15m', '1h', '4h', '1d')
        limit: Number of candles to fetch (default 30)
        exchange_name: Exchange name (default 'coinbasepro', can be 'coinbasepro', 'kraken', 'okx', 'bybit', etc.)
    
    Returns:
        List of OHLCV data from CCXT
    """
    # Fallback exchanges to try if primary fails
    fallback_exchanges = ['coinbasepro', 'kraken', 'okx', 'bybit', 'kucoin']
    
    # If exchange_name is in fallback list, use it as primary and remove from fallback
    if exchange_name in fallback_exchanges:
        exchanges_to_try = [exchange_name] + [e for e in fallback_exchanges if e != exchange_name]
    else:
        exchanges_to_try = [exchange_name] + fallback_exchanges
    
    last_error = None
    
    for exchange_name_to_try in exchanges_to_try:
        try:
            # Initialize exchange
            try:
                exchange_class = getattr(ccxt, exchange_name_to_try)
            except AttributeError:
                continue  # Try next exchange
            
            exchange = exchange_class({
                'enableRateLimit': True,
                'options': {
                    'defaultType': 'spot',  # Use spot trading
                }
            })
            
            # Normalize symbol format for this exchange
            normalized_symbol = normalize_symbol(symbol, exchange_name_to_try)
            
            # Map interval to CCXT timeframe format
            timeframe = interval
            
            # Fetch OHLCV data
            ohlcv = exchange.fetch_ohlcv(normalized_symbol, timeframe, limit=limit)
            
            if ohlcv and len(ohlcv) > 0:
                return ohlcv
                
        except ccxt.BaseError as e:
            error_str = str(e)
            last_error = error_str
            # Check for blocking/restriction errors
            if '451' in error_str or 'restricted' in error_str.lower() or 'unavailable' in error_str.lower():
                # Continue to next exchange
                continue
            # For other errors, also try next exchange
            continue
        except Exception as e:
            last_error = str(e)
            continue
    
    # If all exchanges failed
    raise Exception(
        f"Failed to fetch data from all attempted exchanges. "
        f"Tried: {', '.join(exchanges_to_try)}. "
        f"Last error: {last_error}"
    )


def to_dataframe(klines_data: list) -> pd.DataFrame:
    """
    Convert CCXT OHLCV data to DataFrame.
    
    CCXT OHLCV format:
    [
        [timestamp_ms, open, high, low, close, volume],
        ...
    ]
    """
    rows = []
    for kline in klines_data:
        ts = int(kline[0] / 1000)  # Convert milliseconds to seconds
        
        rows.append({
            "timestamp": ts,
            "open": float(kline[1]),
            "high": float(kline[2]),
            "low": float(kline[3]),
            "close": float(kline[4]),
            "volume": float(kline[5])
        })
    
    df = pd.DataFrame(rows)
    
    df["timestamp_iso"] = pd.to_datetime(df.timestamp, unit="s")
    df["timestamp_iso"] = df["timestamp_iso"].dt.tz_localize('UTC').dt.tz_convert('Asia/Kolkata')
    df = df.set_index("timestamp_iso").sort_index()
    
    df = df[["open", "high", "low", "close", "volume"]]
    return df




if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--symbol", required=True, help="Trading pair symbol (e.g., BTCUSDT)")
    parser.add_argument("--interval", type=str, default="1d", help="Timeframe interval (e.g., 1m, 5m, 15m, 1h, 4h, 1d)")
    parser.add_argument("--limit", type=int, default=30, help="Number of candles to fetch (default 30)")
    parser.add_argument("--exchange", type=str, default="coinbasepro", help="Exchange name (default: coinbasepro, options: coinbasepro, kraken, okx, bybit, kucoin, etc.)")
    args = parser.parse_args()

    raw = fetch_klines(args.symbol, args.interval, args.limit, args.exchange)
    df = to_dataframe(raw)
    out_path = f"{DATA_DIR}/{args.symbol}_prices_{args.limit}candles_{args.interval}.csv"
    df.to_csv(out_path)
    print(f"Saved CSV -> {out_path}")