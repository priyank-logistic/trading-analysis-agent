"""
FastAPI wrapper around the CryptoAnalytica LangGraph pipeline.
Run: uvicorn api.main:app --reload --port 8000
The frontend (Next.js) should be running on http://localhost:3000
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from graph import build_graph, run_pipeline

app = FastAPI(title="CryptoAnalytica API", version="2.0")
graph_app = build_graph()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    coin: str
    higher_timeframe: str = "4h"
    lower_timeframe: str = "15m"
    limit: int = 30


@app.post("/analyze")
def analyze_coin(req: AnalyzeRequest):
    try:
        result = run_pipeline(
            graph_app,
            coin=req.coin,
            higher_timeframe=req.higher_timeframe,
            lower_timeframe=req.lower_timeframe,
            limit=req.limit,
        )
        return result
    except Exception as e:
        import traceback
        error_detail = f"Pipeline failed: {str(e)}\n\nTraceback:\n{traceback.format_exc()}"
        print(f"ERROR: {error_detail}")
        raise HTTPException(status_code=500, detail=f"Pipeline failed: {str(e)}")


@app.get("/")
def root():
    """API root endpoint"""
    return {"message": "CryptoAnalytica API", "version": "2.0", "endpoints": ["/analyze"]}

