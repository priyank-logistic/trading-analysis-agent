"""
Fetch OHLCV time series from SmartAPI for Indian market indices.
"""
import os
import pandas as pd
import pyotp
import time as t
from datetime import datetime, timedelta
from SmartApi import SmartConnect
from utils import DATA_DIR
import pytz
import json


_smartapi_session = None
_last_request_time = 0
MIN_REQUEST_INTERVAL = 0.5  


CLIENT_CODE = os.getenv("SMARTAPI_CLIENT_CODE", "HEEB1141")
PASSWORD = os.getenv("SMARTAPI_PASSWORD", "8567")
TOTP_SECRET = os.getenv("SMARTAPI_TOTP", "ZWXAUZOUP6KTEUH3DYPJD5QI34")
API_KEY = os.getenv("SMARTAPI_KEY", "L5IoqK0k")

INDIAN_MARKET_TOKENS = {
    "NIFTY50": "99926000",
    "BANKNIFTY": "99926009",
    
    "TCS": "11536",
    "NTPC": "11630",
    "JSWSTEEL": "11723",
    "BHARTIARTL": "10604",
    "DIVISLAB": "10940",
    "LT": "11483",
    "ULTRACEMCO": "11532",
    "HDFCBANK": "1333",
    "HEROMOTOCO": "1348",
    "TECHM": "13538",
    "GRASIM": "1232",
    "HINDALCO": "1363",
    "HINDUNILVR": "1394",
    "MARUTI": "10999",
    "BAJAJFINSV": "16675",
    "COALINDIA": "20374",
    "ASIANPAINT": "236",
    "APOLLOHOSP": "157",
    "RELIANCE": "2885",
    "M&M": "2031",
    "SBILIFE": "21808",
    "POWERGRID": "14977",
    "IOC": "1624",
    "ITC": "1660",
    "NESTLEIND": "17963",
    "BAJAJ-AUTO": "16669",
    "INFY": "1594",
    "KOTAKBANK": "1922",
    "ADANIENT": "25",
    "ONGC": "2475",
    "ADANIPORTS": "15083",
    "BAJFINANCE": "317",
    "TATACONSUM": "3432",
    "HDFCLIFE": "467",
    "SUNPHARMA": "3351",
    "BEL": "383",
    "AXISBANK": "5900",
    "SBIN": "3045",
    "TITAN": "3506",
    "WIPRO": "3787",
    "BPCL": "526",
    "HCLTECH": "7229",
    "EICHERMOT": "910",
    "INDUSINDBK": "5258",
    "BRITANNIA": "547",
    "CIPLA": "694",
    "TATAMOTORS": "3456",
    "DRREDDY": "881",
    "TATASTEEL": "3499",
    "ICICIBANK": "4963",
    
    "TCS.NS": "11536",
    "NTPC.NS": "11630",
    "JSWSTEEL.NS": "11723",
    "BHARTIARTL.NS": "10604",
    "DIVISLAB.NS": "10940",
    "LT.NS": "11483",
    "ULTRACEMCO.NS": "11532",
    "HDFCBANK.NS": "1333",
    "HEROMOTOCO.NS": "1348",
    "TECHM.NS": "13538",
    "GRASIM.NS": "1232",
    "HINDALCO.NS": "1363",
    "HINDUNILVR.NS": "1394",
    "MARUTI.NS": "10999",
    "BAJAJFINSV.NS": "16675",
    "COALINDIA.NS": "20374",
    "ASIANPAINT.NS": "236",
    "APOLLOHOSP.NS": "157",
    "RELIANCE.NS": "2885",
    "M&M.NS": "2031",
    "SBILIFE.NS": "21808",
    "POWERGRID.NS": "14977",
    "IOC.NS": "1624",
    "ITC.NS": "1660",
    "NESTLEIND.NS": "17963",
    "BAJAJ-AUTO.NS": "16669",
    "INFY.NS": "1594",
    "KOTAKBANK.NS": "1922",
    "ADANIENT.NS": "25",
    "ONGC.NS": "2475",
    "ADANIPORTS.NS": "15083",
    "BAJFINANCE.NS": "317",
    "TATACONSUM.NS": "3432",
    "HDFCLIFE.NS": "467",
    "SUNPHARMA.NS": "3351",
    "BEL.NS": "383",
    "AXISBANK.NS": "5900",
    "SBIN.NS": "3045",
    "TITAN.NS": "3506",
    "WIPRO.NS": "3787",
    "BPCL.NS": "526",
    "HCLTECH.NS": "7229",
    "EICHERMOT.NS": "910",
    "INDUSINDBK.NS": "5258",
    "BRITANNIA.NS": "547",
    "CIPLA.NS": "694",
    "TATAMOTORS.NS": "3456",
    "DRREDDY.NS": "881",
    "TATASTEEL.NS": "3499",
    "ICICIBANK.NS": "4963",
}

TOKEN_TO_SYMBOL = {
    "99926000": "NIFTY 50",
    "99926009": "BANKNIFTY",
    "11536": "TCS",
    "11630": "NTPC",
    "11723": "JSWSTEEL",
    "10604": "BHARTIARTL",
    "10940": "DIVISLAB",
    "11483": "LT",
    "11532": "ULTRACEMCO",
    "1333": "HDFCBANK",
    "1348": "HEROMOTOCO",
    "13538": "TECHM",
    "1232": "GRASIM",
    "1363": "HINDALCO",
    "1394": "HINDUNILVR",
    "10999": "MARUTI",
    "16675": "BAJAJFINSV",
    "20374": "COALINDIA",
    "236": "ASIANPAINT",
    "157": "APOLLOHOSP",
    "2885": "RELIANCE",
    "2031": "M&M",
    "21808": "SBILIFE",
    "14977": "POWERGRID",
    "1624": "IOC",
    "1660": "ITC",
    "17963": "NESTLEIND",
    "16669": "BAJAJ-AUTO",
    "1594": "INFY",
    "1922": "KOTAKBANK",
    "25": "ADANIENT",
    "2475": "ONGC",
    "15083": "ADANIPORTS",
    "317": "BAJFINANCE",
    "3432": "TATACONSUM",
    "467": "HDFCLIFE",
    "3351": "SUNPHARMA",
    "383": "BEL",
    "5900": "AXISBANK",
    "3045": "SBIN",
    "3506": "TITAN",
    "3787": "WIPRO",
    "526": "BPCL",
    "7229": "HCLTECH",
    "910": "EICHERMOT",
    "5258": "INDUSINDBK",
    "547": "BRITANNIA",
    "694": "CIPLA",
    "3456": "TATAMOTORS",
    "881": "DRREDDY",
    "3499": "TATASTEEL",
    "4963": "ICICIBANK",
}

TIMEFRAME_MAPPING = {
    "1m": "ONE_MINUTE",
    "3m": "THREE_MINUTE",
    "5m": "FIVE_MINUTE",
    "15m": "FIFTEEN_MINUTE",
    "30m": "THIRTY_MINUTE",
    "1h": "ONE_HOUR",
    "4h": "FOUR_HOUR",
    "1d": "ONE_DAY",
}


def smart_api_login(force_new=False):
    """
    Login to SmartAPI and return the connection object.
    Uses session caching to avoid multiple logins.
    """
    global _smartapi_session
    
    if _smartapi_session is not None and not force_new:
        return _smartapi_session
    
    try:
        smart_api_obj = SmartConnect(API_KEY, timeout=90, disable_ssl=True)
        totp = pyotp.TOTP(TOTP_SECRET).now()
        data = smart_api_obj.generateSession(CLIENT_CODE, PASSWORD, totp)
        
        if data.get('status') == False:
            error_msg = data.get('message', 'Unknown error during SmartAPI login')
            raise Exception(f"SmartAPI login failed: {error_msg}")
        
        _smartapi_session = smart_api_obj
        return smart_api_obj
    except Exception as e:
        _smartapi_session = None
        raise Exception(f"Failed to connect to SmartAPI: {str(e)}")


def rate_limit_delay():
    """Add delay between requests to avoid rate limiting."""
    global _last_request_time
    current_time = t.time()
    time_since_last = current_time - _last_request_time
    
    if time_since_last < MIN_REQUEST_INTERVAL:
        sleep_time = MIN_REQUEST_INTERVAL - time_since_last
        t.sleep(sleep_time)
    
    _last_request_time = t.time()


def get_token_for_symbol(symbol: str) -> str:
    """
    Get SmartAPI token for a given symbol.
    
    Args:
        symbol: Symbol name (e.g., 'NIFTY50', 'RELIANCE') or token (e.g., '99926000')
    
    Returns:
        Token string for SmartAPI
    """
    symbol_upper = symbol.upper()
    
    if symbol_upper in INDIAN_MARKET_TOKENS:
        return INDIAN_MARKET_TOKENS[symbol_upper]
    
    if symbol_upper in TOKEN_TO_SYMBOL:
        return symbol_upper
    
    return symbol


def map_timeframe_to_smartapi(interval: str) -> tuple:
    """
    Map system timeframe to SmartAPI format.
    Returns (smartapi_interval, needs_aggregation, aggregation_params)
    """
    interval_lower = interval.lower()
    
    if interval_lower == "4h":
        return ("ONE_HOUR", True, {
            'interval': '4h',
            'offset': '1h15min'
        })
    elif interval_lower in TIMEFRAME_MAPPING:
        smartapi_interval = TIMEFRAME_MAPPING[interval_lower]
        if smartapi_interval == "FOUR_HOUR":
            return ("ONE_HOUR", True, {
                'interval': '4h',
                'offset': '1h15min'
            })
        return (smartapi_interval, False, None)
    else:
        mapping = {
            "1m": "ONE_MINUTE",
            "3m": "THREE_MINUTE",
            "5m": "FIVE_MINUTE",
            "15m": "FIFTEEN_MINUTE",
            "30m": "THIRTY_MINUTE",
            "1h": "ONE_HOUR",
            "1d": "ONE_DAY",
        }
        return (mapping.get(interval_lower, "FIFTEEN_MINUTE"), False, None)


def fetch_klines(symbol: str, interval: str = "15m", limit: int = 30):
    """
    Fetch klines (candlestick) data from SmartAPI for Indian market.
    
    The function automatically calculates the date range needed based on:
    - The timeframe (e.g., 1D, 15m)
    - The number of candles requested
    
    Examples:
    - 60 candles of 1D = fetches ~90 days of data (60 days + buffer for weekends/holidays)
    - 60 candles of 15m = fetches ~4 days of data (60/25 candles per day + buffer)
    
    Args:
        symbol: Index or stock symbol (e.g., 'NIFTY50', 'BANKNIFTY', 'RELIANCE')
        interval: Timeframe interval (e.g., '5m', '15m', '1h', '4h', '1d')
        limit: Number of candles to fetch
    
    Returns:
        List of kline data in format similar to Binance
    """
    obj = smart_api_login()
    token = get_token_for_symbol(symbol)
    
    smartapi_interval, needs_aggregation, agg_params = map_timeframe_to_smartapi(interval)
    
    end_date = datetime.now(pytz.timezone('Asia/Kolkata'))
    
    days_needed = calculate_days_needed(interval, limit)
    start_date = end_date - timedelta(days=days_needed)
    
    min_start_date = end_date - timedelta(days=365)
    if start_date < min_start_date:
        start_date = min_start_date
    
    print(f"Fetching {symbol} data: {limit} candles of {interval} timeframe")
    print(f"  Date range: {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')} ({days_needed} days)")
    
    param = {
        "exchange": "NSE",
        "symboltoken": token,
        "interval": smartapi_interval,
        "fromdate": start_date.strftime("%Y-%m-%d 09:15"),
        "todate": end_date.strftime("%Y-%m-%d 15:30")
    }
    
    max_retries = 3
    retry_delay = 2
    response = None
    
    for attempt in range(max_retries):
        try:
            rate_limit_delay()
            
            response = obj.getCandleData(param)
            
            if response.get('status') == False:
                error_msg = response.get('message', 'Unknown error')
                error_str = str(error_msg).lower()
                
                if 'rate' in error_str or 'access denied' in error_str or 'exceeding' in error_str:
                    if attempt < max_retries - 1:
                        wait_time = retry_delay * (2 ** attempt)
                        print(f"Rate limit hit. Waiting {wait_time} seconds before retry {attempt + 1}/{max_retries}...")
                        t.sleep(wait_time)
                        response = None
                        continue
                    else:
                        raise Exception(f"SmartAPI rate limit exceeded after {max_retries} attempts. Please wait a few minutes and try again.")
                
                raise ValueError(f"SmartAPI error for {symbol}: {error_msg}")
            
            if "data" not in response or not response["data"]:
                raise ValueError(f"No data returned from SmartAPI for {symbol}. Response: {response}")
            
            break
            
        except Exception as e:
            error_str = str(e).lower()
            if ('rate' in error_str or 'access denied' in error_str or 'exceeding' in error_str or 
                'connection' in error_str or 'timeout' in error_str):
                if attempt < max_retries - 1:
                    wait_time = retry_delay * (2 ** attempt)
                    print(f"Request failed ({str(e)}). Waiting {wait_time} seconds before retry {attempt + 1}/{max_retries}...")
                    t.sleep(wait_time)
                    response = None
                    continue
                else:
                    raise Exception(f"Failed to fetch data after {max_retries} attempts: {str(e)}")
            else:
                raise
    
    if response is None or "data" not in response:
        raise Exception(f"Failed to fetch data from SmartAPI for {symbol} after {max_retries} attempts")
    
    try:
        candle_data = response["data"]
        df = pd.DataFrame(
            data=candle_data,
            columns=['timestamp', 'open', 'high', 'low', 'close', 'volume']
        )
        
        df['timestamp'] = pd.to_datetime(df["timestamp"])
        
        if needs_aggregation and agg_params:
            df.set_index('timestamp', inplace=True)
            agg_dict = {
                'open': 'first',
                'high': 'max',
                'low': 'min',
                'close': 'last',
                'volume': 'sum'
            }
            df = df.resample("4h", offset=agg_params['offset']).agg(agg_dict).reset_index()
            df.dropna(inplace=True)
        
        klines = []
        for _, row in df.tail(limit).iterrows():
            timestamp_ms = int(row['timestamp'].timestamp() * 1000)
            klines.append([
                timestamp_ms,
                float(row['open']),
                float(row['high']),
                float(row['low']),
                float(row['close']),
                float(row['volume']),
                timestamp_ms,
                0, 0, 0, 0, 0
            ])
        
        return klines[-limit:] if len(klines) > limit else klines
        
    except Exception as e:
        raise Exception(f"Error fetching data from SmartAPI: {str(e)}")


def get_candles_per_day(interval: str) -> float:
    """
    Calculate number of candles per trading day for Indian market.
    
    Indian market trading hours: 9:15 AM to 3:30 PM IST = 375 minutes per day
    Trading days: Monday to Friday (excluding holidays)
    """
    interval_lower = interval.lower()
    interval_map = {
        "1m": 375.0,
        "3m": 125.0,
        "5m": 75.0,
        "15m": 25.0,
        "30m": 12.5,
        "1h": 6.25,
        "4h": 1.5,
        "1d": 1.0,
    }
    return interval_map.get(interval_lower, 25.0)


def calculate_days_needed(interval: str, limit: int) -> int:
    """
    Calculate the number of calendar days needed to fetch enough data.
    
    The calculation ensures we fetch enough data to get the requested number of candles,
    accounting for weekends, holidays, and market hours.
    
    Examples:
    - 60 candles of 1D = 60 days (plus buffer for weekends/holidays) ≈ 90 days
    - 60 candles of 15m = 60/25 = 2.4 trading days ≈ 4 calendar days (with buffer)
    
    Args:
        interval: Timeframe (e.g., '15m', '1d')
        limit: Number of candles requested
    
    Returns:
        Number of calendar days needed (including buffer for weekends/holidays)
    """
    candles_per_day = get_candles_per_day(interval)
    
    if candles_per_day <= 0:
        return max(limit, 30)
    
    if interval.lower() == "1d":
        calendar_days = int(limit * 1.5)
        return max(calendar_days, limit)
    
    trading_days_needed = limit / candles_per_day
    
    calendar_days = int(trading_days_needed * (7/5) * 1.1)
    
    if interval.lower() in ["15m", "30m"]:
        calendar_days = max(calendar_days, 15)
    elif interval.lower() in ["1h", "4h"]:
        calendar_days = max(calendar_days, 10)
    elif interval.lower() in ["1m", "3m", "5m"]:
        calendar_days = max(calendar_days, 10)
    else:
        calendar_days = max(calendar_days, 5)
    
    return calendar_days


def to_dataframe(klines_data: list) -> pd.DataFrame:
    """
    Convert SmartAPI klines data to DataFrame (same format as Binance).
    
    Format: [open_time_ms, open, high, low, close, volume, ...]
    """
    rows = []
    for kline in klines_data:
        ts = int(kline[0] / 1000) if len(kline) > 0 else 0
        
        rows.append({
            "timestamp": ts,
            "open": float(kline[1]) if len(kline) > 1 else 0,
            "high": float(kline[2]) if len(kline) > 2 else 0,
            "low": float(kline[3]) if len(kline) > 3 else 0,
            "close": float(kline[4]) if len(kline) > 4 else 0,
            "volume": float(kline[5]) if len(kline) > 5 else 0,
        })
    
    df = pd.DataFrame(rows)
    
    if len(df) > 0:
        df["timestamp_iso"] = pd.to_datetime(df.timestamp, unit="s")
        df["timestamp_iso"] = df["timestamp_iso"].dt.tz_localize('UTC').dt.tz_convert('Asia/Kolkata')
        df = df.set_index("timestamp_iso").sort_index()
    
    df = df[["open", "high", "low", "close", "volume"]]
    return df


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--symbol", required=True, help="Index symbol (e.g., NIFTY50, BANKNIFTY)")
    parser.add_argument("--interval", type=str, default="15m", help="Timeframe interval")
    parser.add_argument("--limit", type=int, default=30, help="Number of candles to fetch")
    args = parser.parse_args()

    raw = fetch_klines(args.symbol, args.interval, args.limit)
    df = to_dataframe(raw)
    out_path = f"{DATA_DIR}/{args.symbol}_prices_{args.limit}candles_{args.interval}.csv"
    df.to_csv(out_path)
    print(f"Saved CSV -> {out_path}")

