# CryptoAnalytica - Cryptocurrency SMC Analysis Tool

AI-powered cryptocurrency analysis tool that fetches coin price timeseries from Binance API, analyzes raw OHLCV data, and generates Smart Money Concepts (SMC) based trading analysis via LangChain + OpenAI.

## Project Structure

```
agent-crypto/
├── api/              # Backend API (FastAPI)
│   └── main.py       # FastAPI application
├── frontend/         # Frontend (Next.js)
│   └── src/          # Next.js source code
├── data/             # CSV data storage
├── graph.py          # LangGraph pipeline
├── prompts.py        # AI prompts
├── fetch_coin_data.py # Binance data fetcher
└── requirements.txt   # Python dependencies
```

## Prerequisites

- Python 3.12+
- Node.js 18+ and npm
- OpenAI API Key

## Setup

### 1. Backend Setup

1. **Create a virtual environment** (recommended):

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install Python dependencies**:

```bash
pip install -r requirements.txt
```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

## Running the Application

### Backend (FastAPI)

1. **Activate virtual environment** (if not already activated):

```bash
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Start the backend server**:

```bash
uvicorn api.main:app --reload --port 8000
```

The backend API will be available at: `http://localhost:8000`

**API Endpoints:**

- `GET /` - API information
- `POST /analyze` - Analyze cryptocurrency

**Example API Request:**

```bash
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: application/json" \
  -d '{"coin": "BTCUSDT", "timeframe": "4h", "limit": 30}'
```

### Frontend (Next.js)

1. **Open a new terminal** (keep backend running)

2. **Navigate to frontend directory**:

```bash
cd frontend
```

## Usage

1. **Start the backend** (port 8000)
2. **Start the frontend** (port 3000) in a separate terminal
3. **Open your browser** and visit: `http://localhost:3000`
4. **Select a cryptocurrency** from the dropdown (10 popular coins available)
5. **Choose a timeframe** (1m, 5m, 15m, 1h, 4h, 1d)
6. **Enter number of candles** (25-1000)
7. **Click "Analyze Cryptocurrency"**
8. **View the analysis** in the tabs:
   - **SMC Analysis**: Market structure, CHoCH, resistance/support levels, order blocks, FVG
   - **Trading Setups**: Entry, stop loss, and target levels with risk:reward ratios
   - **Raw Response**: Full AI response in JSON format

## Features

- **10 Popular Cryptocurrencies**: BTC, ETH, BNB, SOL, XRP, ADA, DOGE, DOT, MATIC, LTC
- **Multiple Timeframes**: 1m, 5m, 15m, 1h, 4h, 1d
- **Smart Money Concepts (SMC) Analysis**:
  - Market Structure (Trend, Phase)
  - Change of Character (CHoCH)
  - Resistance and Support Levels
  - Order Blocks (Bullish/Bearish)
  - Fair Value Gaps (FVG)
- **Trading Setups**: Entry, Stop Loss, and Target levels with calculations
- **JSON Output**: Structured analysis in JSON format

## API Request Format

```json
{
  "coin": "BTCUSDT",
  "timeframe": "4h",
  "limit": 30
}
```

## API Response Format

```json
{
  "analysis": "{...JSON string...}",
  "current_price": 12345.67,
  "coin": "BTCUSDT",
  "timeframe": "4h",
  "limit": 30
}
```

## Notes

- The backend fetches data from Binance API and stores it in CSV format
- AI analyzes raw OHLCV (Open, High, Low, Close, Volume) data
- Analysis is based on historical data patterns only - no future predictions
- Make sure both backend and frontend are running simultaneously
- Backend must be running on port 8000 for frontend to work

## Troubleshooting

- **Backend not starting**: Check if port 8000 is available, ensure virtual environment is activated
- **Frontend can't connect**: Verify backend is running on `http://localhost:8000`
- **API errors**: Check your OpenAI API key in `.env` file
- **Data not loading**: Ensure you have internet connection for Binance API access
