# Crypto SMC Analysis Frontend

Next.js frontend for the Cryptocurrency Smart Money Concepts (SMC) Analysis tool.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Make sure the backend API is running on `http://localhost:8000`

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `src/app/page.js` - Main page component
- `src/components/SMCAnalysis.js` - SMC Analysis display component
- `src/components/TradingSetups.js` - Trading Setups display component
- `src/lib/utils.js` - Utility functions for parsing JSON
- `src/app/globals.css` - Global styles (same as original HTML)

## Features

- Coin selection (10 popular cryptocurrencies)
- Timeframe selection (1m, 5m, 15m, 1h, 4h, 1d)
- Number of candles input (25-1000)
- SMC Analysis display with card-based layout
- Trading Setups display with structured cards
- Raw Response tab to view full AI response
- Tab switching between SMC Analysis, Trading Setups, and Raw Response

## API

The frontend calls the backend API at `http://localhost:8000/analyze` with:

- `coin`: Cryptocurrency symbol (e.g., "BTCUSDT")
- `timeframe`: Timeframe string (e.g., "4h")
- `limit`: Number of candles (25-1000)
