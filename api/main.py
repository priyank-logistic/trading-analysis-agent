"""
FastAPI wrapper around the CryptoAnalytica LangGraph pipeline.
Run: uvicorn api.main:app --reload --port 8000
The frontend (Next.js) should be running on http://localhost:3000
"""
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from graph import build_graph, run_pipeline
from typing import Set

app = FastAPI(title="CryptoAnalytica API", version="2.0")
graph_app = build_graph()

running_tasks: Set[asyncio.Task] = set()

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
    market_type: str = "crypto"


async def run_pipeline_async(coin: str, higher_timeframe: str, lower_timeframe: str, limit: int, market_type: str):
    """Run pipeline in async executor to allow cancellation"""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(
        None,
        run_pipeline,
        graph_app,
        coin,
        higher_timeframe,
        lower_timeframe,
        limit,
        market_type
    )


@app.post("/analyze")
async def analyze_coin(req: AnalyzeRequest):
    try:
        task = asyncio.create_task(
            run_pipeline_async(
                coin=req.coin,
                higher_timeframe=req.higher_timeframe,
                lower_timeframe=req.lower_timeframe,
                limit=req.limit,
                market_type=req.market_type,
            )
        )
        
        running_tasks.add(task)
        
        try:
            result = await task
            return result
        except asyncio.CancelledError:
            raise HTTPException(status_code=499, detail="Request was cancelled")
        finally:
            running_tasks.discard(task)
            
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_detail = f"Pipeline failed: {str(e)}\n\nTraceback:\n{traceback.format_exc()}"
        print(f"ERROR: {error_detail}")
        raise HTTPException(status_code=500, detail=f"Pipeline failed: {str(e)}")


@app.post("/cancel")
async def cancel_all():
    """Cancel all running processes"""
    cancelled_count = 0
    for task in list(running_tasks):
        if not task.done():
            task.cancel()
            cancelled_count += 1
    
    if running_tasks:
        await asyncio.gather(*running_tasks, return_exceptions=True)
        running_tasks.clear()
    
    return {
        "message": "All processes cancelled",
        "cancelled_count": cancelled_count,
        "status": "success"
    }


@app.get("/")
def root():
    """API root endpoint"""
    return {
        "message": "CryptoAnalytica API", 
        "version": "2.0", 
        "endpoints": ["/analyze", "/cancel"]
    }

