"use client";

import { useState } from "react";
import SMCAnalysis from "@/components/SMCAnalysis";
import TradingSetups from "@/components/TradingSetups";
import PriceActionChart from "@/components/PriceActionChart";
import MarketAnalysis from "@/components/MarketAnalysis";
import PriceActionDetail from "@/components/PriceActionDetail";
import { parseAnalysis } from "@/lib/utils";

export default function Home() {
  const [marketType, setMarketType] = useState("crypto"); // "crypto" or "indian"
  const [coin, setCoin] = useState("BTCUSDT");
  const [higherTimeframe, setHigherTimeframe] = useState("4h");
  const [lowerTimeframe, setLowerTimeframe] = useState("15m");
  const [limit, setLimit] = useState(30);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("price");
  const [rawResponse, setRawResponse] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [priceData, setPriceData] = useState(null);
  const [marketAnalysisData, setMarketAnalysisData] = useState(null);
  const [technicalIndicators, setTechnicalIndicators] = useState(null);
  const [priceActionDetail, setPriceActionDetail] = useState(null);
  const [technicalIndicatorsAnalysis, setTechnicalIndicatorsAnalysis] =
    useState(null);
  const [coinTitle, setCoinTitle] = useState("📊 Crypto SMC Analysis");
  const [timeframeInfo, setTimeframeInfo] = useState(
    "Select coin and timeframes to analyze"
  );
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowResults(false);

    const formData = {
      coin: coin.toUpperCase(),
      higher_timeframe: higherTimeframe,
      lower_timeframe: lowerTimeframe,
      limit,
      market_type: marketType,
    };

    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setRawResponse(data.analysis || "");

      setPriceData(data.price_data || null);

      setMarketAnalysisData(data.market_analysis || null);

      setTechnicalIndicators(data.technical_indicators || null);

      let parsedPriceActionDetail = null;
      let parsedTechnicalIndicatorsAnalysis = null;
      try {
        const jsonMatch = (data.analysis || "").match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedJson = JSON.parse(jsonMatch[0]);
          parsedPriceActionDetail = parsedJson.price_action_detail || null;
          parsedTechnicalIndicatorsAnalysis =
            parsedJson.technical_indicators_analysis || null;
        }
      } catch (e) {
        console.error("Failed to parse price action detail:", e);
      }

      setPriceActionDetail(parsedPriceActionDetail);
      setTechnicalIndicatorsAnalysis(parsedTechnicalIndicatorsAnalysis);

      const parsed = parseAnalysis(data.analysis || "");

      if (
        data.current_price &&
        (!parsed.marketStructure.price ||
          parsed.marketStructure.price === "N/A")
      ) {
        parsed.marketStructure.price = data.current_price.toFixed(2);
      }

      setAnalysisData(parsed);

      const marketLabel = marketType === "indian" ? "Indian Market" : "Crypto";
      setCoinTitle(`${coin.toUpperCase()} - ${marketLabel} SMC Analysis`);
      setTimeframeInfo(
        `Higher: ${higherTimeframe.toUpperCase()} | Lower: ${lowerTimeframe.toUpperCase()} | ${limit} Candles`
      );

      setLoading(false);
      setShowResults(true);
      setActiveTab("price");
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
  };

  const copyRawResponse = () => {
    if (rawResponse) {
      navigator.clipboard
        .writeText(rawResponse)
        .then(() => {
          alert("Copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy:", err);
          alert("Failed to copy to clipboard");
        });
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1 id="coinTitle">{coinTitle}</h1>
        <div className="header-subtitle" id="timeframeInfo">
          {timeframeInfo}
        </div>
      </div>

      <div className="form-section">
        <form id="analysisForm" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="marketType">Market Type</label>
              <select
                id="marketType"
                name="marketType"
                value={marketType}
                onChange={(e) => {
                  setMarketType(e.target.value);
                  // Reset coin when switching market type
                  if (e.target.value === "indian") {
                    setCoin("NIFTY50");
                  } else {
                    setCoin("BTCUSDT");
                  }
                }}
                required
              >
                <option value="crypto">Cryptocurrency</option>
                <option value="indian">Indian Market</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="coin">
                {marketType === "indian" ? "Indian Index" : "Cryptocurrency"}
              </label>
              <select
                id="coin"
                name="coin"
                value={coin}
                onChange={(e) => setCoin(e.target.value)}
                required
              >
                {marketType === "indian" ? (
                  <>
                    <optgroup label="Indices">
                      <option value="NIFTY50">Nifty 50</option>
                      <option value="BANKNIFTY">Bank Nifty</option>
                    </optgroup>
                    <optgroup label="Stocks">
                      <option value="TCS">TCS</option>
                      <option value="NTPC">NTPC</option>
                      <option value="JSWSTEEL">JSW Steel</option>
                      <option value="BHARTIARTL">Bharti Airtel</option>
                      <option value="DIVISLAB">Divis Laboratories</option>
                      <option value="LT">Larsen & Toubro</option>
                      <option value="ULTRACEMCO">UltraTech Cement</option>
                      <option value="HDFCBANK">HDFC Bank</option>
                      <option value="HEROMOTOCO">Hero MotoCorp</option>
                      <option value="TECHM">Tech Mahindra</option>
                      <option value="GRASIM">Grasim Industries</option>
                      <option value="HINDALCO">Hindalco Industries</option>
                      <option value="HINDUNILVR">Hindustan Unilever</option>
                      <option value="MARUTI">Maruti Suzuki</option>
                      <option value="BAJAJFINSV">Bajaj Finserv</option>
                      <option value="COALINDIA">Coal India</option>
                      <option value="ASIANPAINT">Asian Paints</option>
                      <option value="APOLLOHOSP">Apollo Hospitals</option>
                      <option value="RELIANCE">Reliance Industries</option>
                      <option value="M&M">Mahindra & Mahindra</option>
                      <option value="SBILIFE">SBI Life Insurance</option>
                      <option value="POWERGRID">Power Grid Corporation</option>
                      <option value="IOC">Indian Oil Corporation</option>
                      <option value="ITC">ITC</option>
                      <option value="NESTLEIND">Nestle India</option>
                      <option value="BAJAJ-AUTO">Bajaj Auto</option>
                      <option value="INFY">Infosys</option>
                      <option value="KOTAKBANK">Kotak Mahindra Bank</option>
                      <option value="ADANIENT">Adani Enterprises</option>
                      <option value="ONGC">Oil & Natural Gas Corp</option>
                      <option value="ADANIPORTS">Adani Ports</option>
                      <option value="BAJFINANCE">Bajaj Finance</option>
                      <option value="TATACONSUM">Tata Consumer Products</option>
                      <option value="HDFCLIFE">HDFC Life Insurance</option>
                      <option value="SUNPHARMA">Sun Pharmaceutical</option>
                      <option value="BEL">Bharat Electronics</option>
                      <option value="AXISBANK">Axis Bank</option>
                      <option value="SBIN">State Bank of India</option>
                      <option value="TITAN">Titan Company</option>
                      <option value="WIPRO">Wipro</option>
                      <option value="BPCL">Bharat Petroleum</option>
                      <option value="HCLTECH">HCL Technologies</option>
                      <option value="EICHERMOT">Eicher Motors</option>
                      <option value="INDUSINDBK">IndusInd Bank</option>
                      <option value="BRITANNIA">Britannia Industries</option>
                      <option value="CIPLA">Cipla</option>
                      <option value="TATAMOTORS">Tata Motors</option>
                      <option value="DRREDDY">
                        Dr. Reddy&apos;s Laboratories
                      </option>
                      <option value="TATASTEEL">Tata Steel</option>
                      <option value="ICICIBANK">ICICI Bank</option>
                    </optgroup>
                  </>
                ) : (
                  <>
                    <option value="BTCUSDT">Bitcoin (BTCUSDT)</option>
                    <option value="ETHUSDT">Ethereum (ETHUSDT)</option>
                    <option value="BNBUSDT">Binance Coin (BNBUSDT)</option>
                    <option value="SOLUSDT">Solana (SOLUSDT)</option>
                    <option value="XRPUSDT">Ripple (XRPUSDT)</option>
                    <option value="ADAUSDT">Cardano (ADAUSDT)</option>
                    <option value="DOGEUSDT">Dogecoin (DOGEUSDT)</option>
                    <option value="DOTUSDT">Polkadot (DOTUSDT)</option>
                    <option value="MATICUSDT">Polygon (MATICUSDT)</option>
                    <option value="LTCUSDT">Litecoin (LTCUSDT)</option>
                  </>
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="higherTimeframe">Higher Timeframe</label>
              <select
                id="higherTimeframe"
                name="higherTimeframe"
                value={higherTimeframe}
                onChange={(e) => setHigherTimeframe(e.target.value)}
                required
              >
                <option value="1h">1 Hour</option>
                <option value="4h">4 Hours</option>
                <option value="1d">1 Day</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="lowerTimeframe">Lower Timeframe</label>
              <select
                id="lowerTimeframe"
                name="lowerTimeframe"
                value={lowerTimeframe}
                onChange={(e) => setLowerTimeframe(e.target.value)}
                required
              >
                <option value="1m">1 Minute</option>
                <option value="5m">5 Minutes</option>
                <option value="15m">15 Minutes</option>
                <option value="1h">1 Hour</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="limit">Number of Candles</label>
              <input
                type="number"
                id="limit"
                name="limit"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value) || "")}
                min="1"
                max="1000"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading
              ? "Analyzing..."
              : marketType === "indian"
              ? "Analyze Indian Market"
              : "Analyze Cryptocurrency"}
          </button>
        </form>

        {loading && (
          <div className="loading" style={{ display: "block" }}>
            <div className="spinner"></div>
            <p>AI is analyzing the market data...</p>
          </div>
        )}
      </div>

      {showResults && (
        <div id="resultsContainer">
          <div className="tabs-container">
            <div className="tabs">
              <button
                className={`tab ${activeTab === "price" ? "active" : ""}`}
                onClick={() => setActiveTab("price")}
              >
                Price Action
              </button>
              <button
                className={`tab ${activeTab === "smc" ? "active" : ""}`}
                onClick={() => setActiveTab("smc")}
              >
                SMC Analysis
              </button>
              <button
                className={`tab ${activeTab === "trading" ? "active" : ""}`}
                onClick={() => setActiveTab("trading")}
              >
                Trading Setups
              </button>
              <button
                className={`tab ${activeTab === "market" ? "active" : ""}`}
                onClick={() => setActiveTab("market")}
              >
                Market Analysis
              </button>
              <button
                className={`tab ${activeTab === "detail" ? "active" : ""}`}
                onClick={() => setActiveTab("detail")}
              >
                Price Action & Indicators
              </button>
              {/* <button
                className={`tab ${activeTab === "raw" ? "active" : ""}`}
                onClick={() => setActiveTab("raw")}
              >
                Raw Response
              </button> */}
            </div>
          </div>

          <div
            className={`analysis-section ${
              activeTab === "smc" ? "active" : ""
            }`}
            id="smcAnalysis"
            style={{ display: activeTab === "smc" ? "block" : "none" }}
          >
            <div className="cards-grid" id="smcCards">
              {rawResponse && <SMCAnalysis rawResponse={rawResponse} />}
            </div>
          </div>

          <div
            className={`analysis-section ${
              activeTab === "trading" ? "active" : ""
            }`}
            id="tradingSetups"
            style={{ display: activeTab === "trading" ? "block" : "none" }}
          >
            <div id="tradingCards">
              {analysisData && <TradingSetups data={analysisData} />}
            </div>
          </div>

          <div
            className={`analysis-section ${
              activeTab === "price" ? "active" : ""
            }`}
            id="priceAction"
            style={{ display: activeTab === "price" ? "block" : "none" }}
          >
            {priceData && (
              <PriceActionChart
                priceData={priceData}
                supportLevels={analysisData?.support || []}
                resistanceLevels={analysisData?.resistance || []}
              />
            )}
          </div>

          <div
            className={`analysis-section ${
              activeTab === "market" ? "active" : ""
            }`}
            id="marketAnalysis"
            style={{ display: activeTab === "market" ? "block" : "none" }}
          >
            {marketAnalysisData && <MarketAnalysis data={marketAnalysisData} />}
          </div>

          <div
            className={`analysis-section ${
              activeTab === "detail" ? "active" : ""
            }`}
            id="priceActionDetail"
            style={{ display: activeTab === "detail" ? "block" : "none" }}
          >
            <PriceActionDetail
              priceActionDetail={priceActionDetail}
              technicalIndicators={technicalIndicators}
              technicalIndicatorsAnalysis={technicalIndicatorsAnalysis}
              higherTimeframe={higherTimeframe}
              lowerTimeframe={lowerTimeframe}
            />
          </div>

          <div
            className={`analysis-section ${
              activeTab === "raw" ? "active" : ""
            }`}
            id="rawResponse"
            style={{ display: activeTab === "raw" ? "block" : "none" }}
          >
            <div className="raw-response-container">
              <div className="raw-response-header">
                <h3>📄 Full AI Response</h3>
                <button className="copy-btn" onClick={copyRawResponse}>
                  Copy
                </button>
              </div>
              <pre id="rawResponseContent" className="raw-response-content">
                {rawResponse}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
