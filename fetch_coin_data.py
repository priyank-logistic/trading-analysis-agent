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


def fetch_klines(symbol: str, interval: str = "1d", limit: int = 30, exchange_name: str = "binance"):
    """
    Fetch klines (candlestick) data from crypto exchange using CCXT.
    
    Args:
        symbol: Trading pair symbol (e.g., 'BTCUSDT')
        interval: Timeframe interval (e.g., '1m', '5m', '15m', '1h', '4h', '1d')
        limit: Number of candles to fetch (default 30)
        exchange_name: Exchange name (default 'binance', can be 'binance', 'coinbase', 'kraken', etc.)
    
    Returns:
        List of OHLCV data from CCXT
    """
    # Initialize exchange
    try:
        exchange_class = getattr(ccxt, exchange_name)
    except AttributeError:
        raise ValueError(f"Exchange '{exchange_name}' is not supported by CCXT. Available exchanges: {', '.join(ccxt.exchanges)}")
    
    exchange = exchange_class({
        'enableRateLimit': True,
        'options': {
            'defaultType': 'spot',  # Use spot trading
        }
    })
    
    # Map interval to CCXT timeframe format
    # CCXT uses standard timeframes like '1m', '5m', '15m', '1h', '4h', '1d'
    timeframe = interval
    
    try:
        # Fetch OHLCV data
        ohlcv = exchange.fetch_ohlcv(symbol, timeframe, limit=limit)
        return ohlcv
    except Exception as e:
        raise Exception(f"Error fetching data from {exchange_name}: {str(e)}")


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
    parser.add_argument("--exchange", type=str, default="binance", help="Exchange name (default: binance, options: binance, coinbase, kraken, etc.)")
    args = parser.parse_args()

    raw = fetch_klines(args.symbol, args.interval, args.limit, args.exchange)
    df = to_dataframe(raw)
    out_path = f"{DATA_DIR}/{args.symbol}_prices_{args.limit}candles_{args.interval}.csv"
    df.to_csv(out_path)
    print(f"Saved CSV -> {out_path}")