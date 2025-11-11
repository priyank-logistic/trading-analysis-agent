"""
LangGraph pipeline for CryptoAnalytica.

Nodes:
- fetch_node: fetch OHLCV from Binance API and save CSV
- analyze_node: directly read CSV data and generate analysis with LLM

Edges orchestrate: fetch -> analyze
"""
from typing import Dict, Any
import pandas as pd

from langgraph.graph import StateGraph, START, END

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

from utils import DATA_DIR
from fetch_coin_data import fetch_klines, to_dataframe
from prompts import SYSTEM_PROMPT, USER_TEMPLATE


def fetch_node(state: Dict[str, Any]) -> Dict[str, Any]:
    coin = state["coin"]
    higher_timeframe = state.get("higher_timeframe", "4h")
    lower_timeframe = state.get("lower_timeframe", "15m")
    limit = state.get("limit", 30)
    
    raw_higher = fetch_klines(coin, higher_timeframe, limit)
    df_higher = to_dataframe(raw_higher)
    csv_path_higher = f"{DATA_DIR}/{coin}_prices_{limit}candles_{higher_timeframe}.csv"
    df_higher.to_csv(csv_path_higher)
    
    raw_lower = fetch_klines(coin, lower_timeframe, limit)
    df_lower = to_dataframe(raw_lower)
    csv_path_lower = f"{DATA_DIR}/{coin}_prices_{limit}candles_{lower_timeframe}.csv"
    df_lower.to_csv(csv_path_lower)
    
    return {
        **state, 
        "csv_higher": csv_path_higher,
        "csv_lower": csv_path_lower
    }


def analyze_node(state: Dict[str, Any]) -> Dict[str, Any]:
    coin = state["coin"]
    higher_timeframe = state.get("higher_timeframe", "4h")
    lower_timeframe = state.get("lower_timeframe", "15m")
    csv_path_higher = state["csv_higher"]
    csv_path_lower = state["csv_lower"]
    
    df_higher = pd.read_csv(csv_path_higher, parse_dates=[0], index_col=0)
    df_lower = pd.read_csv(csv_path_lower, parse_dates=[0], index_col=0)
    
    current_price = float(df_higher.iloc[-1]["close"]) if len(df_higher) > 0 else None
    
    csv_data_higher = df_higher.to_csv()
    csv_data_lower = df_lower.to_csv()
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT.strip()),
        ("human", USER_TEMPLATE.strip()),
    ])
    try:
        from langchain_core.output_parsers import JsonOutputParser
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
        llm = llm.bind(response_format={"type": "json_object"})
    except Exception as e:
        print(f"Warning: Could not set JSON mode: {e}")
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    chain = prompt | llm
    msg = chain.invoke({
        "coin": coin,
        "higher_timeframe": higher_timeframe,
        "lower_timeframe": lower_timeframe,
        "csv_data_higher": csv_data_higher,
        "csv_data_lower": csv_data_lower,
    })
    text = msg.content if hasattr(msg, "content") else str(msg)
    
    json_text = text
    try:
        import json
        json_match = text.find('{')
        if json_match != -1:
            last_brace = text.rfind('}')
            if last_brace != -1 and last_brace > json_match:
                json_text = text[json_match:last_brace+1]
                json.loads(json_text)
    except:
        json_text = text
    
    df_for_json_higher = pd.read_csv(csv_path_higher)
    df_for_json_lower = pd.read_csv(csv_path_lower)
    
    if 'timestamp_iso' in df_for_json_higher.columns:
        df_for_json_higher['timestamp_iso'] = df_for_json_higher['timestamp_iso'].astype(str)
    if 'timestamp_iso' in df_for_json_lower.columns:
        df_for_json_lower['timestamp_iso'] = df_for_json_lower['timestamp_iso'].astype(str)
    
    df_json_higher = df_for_json_higher.to_dict(orient="records")
    df_json_lower = df_for_json_lower.to_dict(orient="records")
    
    market_analysis = None
    price_action_detail = None
    technical_indicators_analysis = None
    technical_indicators = None
    try:
        import json
        parsed_analysis = json.loads(json_text)
        market_analysis = {
            "sideways_market": parsed_analysis.get("sideways_market"),
            "multi_timeframe": parsed_analysis.get("multi_timeframe")
        }
        price_action_detail = parsed_analysis.get("price_action_detail")
        technical_indicators_analysis = parsed_analysis.get("technical_indicators_analysis")
        
        if technical_indicators_analysis:
            indicators_higher = {}
            if technical_indicators_analysis.get("rsi") and technical_indicators_analysis["rsi"].get("value") is not None:
                indicators_higher["rsi"] = technical_indicators_analysis["rsi"]["value"]
            if technical_indicators_analysis.get("adx") and technical_indicators_analysis["adx"].get("value") is not None:
                indicators_higher["adx"] = technical_indicators_analysis["adx"]["value"]
                indicators_higher["plus_di"] = technical_indicators_analysis["adx"].get("plus_di")
                indicators_higher["minus_di"] = technical_indicators_analysis["adx"].get("minus_di")
            if technical_indicators_analysis.get("ema_9") and technical_indicators_analysis["ema_9"].get("value") is not None:
                indicators_higher["ema_9"] = technical_indicators_analysis["ema_9"]["value"]
            if technical_indicators_analysis.get("ema_20") and technical_indicators_analysis["ema_20"].get("value") is not None:
                indicators_higher["ema_20"] = technical_indicators_analysis["ema_20"]["value"]
            if technical_indicators_analysis.get("ema_50") and technical_indicators_analysis["ema_50"].get("value") is not None:
                indicators_higher["ema_50"] = technical_indicators_analysis["ema_50"]["value"]
            
            technical_indicators = {
                "higher_timeframe": {
                    "latest": indicators_higher,
                    "series": {}
                },
                "lower_timeframe": {
                    "latest": {},
                    "series": {}
                }
            }
    except:
        pass
    
    return {
        **state, 
        "analysis": json_text,
        "current_price": current_price,
        "price_data": df_json_higher,
        "market_analysis": market_analysis,
        "technical_indicators": technical_indicators,
        "technical_indicators_analysis": technical_indicators_analysis,
        "price_action_detail": price_action_detail
    }


def build_graph():
    workflow = StateGraph(dict)
    workflow.add_node("fetch", fetch_node)
    workflow.add_node("analyze", analyze_node)

    workflow.add_edge(START, "fetch")
    workflow.add_edge("fetch", "analyze")
    workflow.add_edge("analyze", END)

    app = workflow.compile()
    return app


def run_pipeline(app, coin: str, higher_timeframe: str = "4h", lower_timeframe: str = "15m", limit: int = 30) -> Dict[str, Any]:
    initial_state = {
        "coin": coin, 
        "higher_timeframe": higher_timeframe, 
        "lower_timeframe": lower_timeframe,
        "limit": limit
    }
    final_state = app.invoke(initial_state)
    return {
        "coin": coin,
        "higher_timeframe": higher_timeframe,
        "lower_timeframe": lower_timeframe,
        "limit": limit,
        "analysis": final_state.get("analysis", ""),
        "current_price": final_state.get("current_price"),
        "price_data": final_state.get("price_data", []),
        "market_analysis": final_state.get("market_analysis"),
        "technical_indicators": final_state.get("technical_indicators"),
        "technical_indicators_analysis": final_state.get("technical_indicators_analysis"),
        "price_action_detail": final_state.get("price_action_detail")
    }
