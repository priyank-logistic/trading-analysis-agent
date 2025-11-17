"""
Fetch OHLCV time series from Binance API and save to CSV.
Usage: python fetch_coin_data.py --symbol BTCUSDT --days 90
"""
import argparse
import requests
import pandas as pd
import time
from utils import DATA_DIR, iso_ts
import pytz
from datetime import datetime, timedelta


BINANCE_BASE = "https://api.binance.me/api/v3"


def fetch_klines(symbol: str, interval: str = "1d", limit: int = 30):
    """
    Fetch klines (candlestick) data from Binance API.
    
    Args:
        symbol: Trading pair symbol (e.g., 'BTCUSDT')
        interval: Timeframe interval (e.g., '1m', '5m', '15m', '1h', '4h', '1d')
        limit: Number of candles to fetch (default 30, max 1000)
    
    Returns:
        List of kline data from Binance API
    """
    url = f"{BINANCE_BASE}/klines"
    
    params = {
        "symbol": symbol,
        "interval": interval,
        "limit": min(limit, 1000)
    }
    
    r = requests.get(url, params=params)
    r.raise_for_status()
    klines = r.json()
    
    return klines[-limit:] if len(klines) > limit else klines


def to_dataframe(klines_data: list) -> pd.DataFrame:
    """
    Convert Binance klines data to DataFrame.
    
    Binance klines format:
    [
        [
            open_time_ms, open, high, low, close, volume,
            close_time_ms, quote_volume, trades_count,
            taker_buy_base_volume, taker_buy_quote_volume, ignore
        ],
        ...
    ]
    """
    rows = []
    for kline in klines_data:
        ts = int(kline[0] / 1000)
        
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
    args = parser.parse_args()

    raw = fetch_klines(args.symbol, args.interval, args.limit)
    df = to_dataframe(raw)
    out_path = f"{DATA_DIR}/{args.symbol}_prices_{args.limit}candles_{args.interval}.csv"
    df.to_csv(out_path)
    print(f"Saved CSV -> {out_path}")