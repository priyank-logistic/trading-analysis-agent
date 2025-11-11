"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  CandlestickSeries,
  LineSeries,
} from "lightweight-charts";

export default function PriceActionChart({
  priceData,
  supportLevels,
  resistanceLevels,
}) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);

  useEffect(() => {
    if (!priceData || priceData.length === 0 || !chartContainerRef.current) {
      return;
    }

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      candlestickSeriesRef.current = null;
    }

    const chartOptions = {
      layout: {
        textColor: "#9ca3af",
        background: { type: ColorType.Solid, color: "#1a1f2e" },
      },
      grid: {
        vertLines: { color: "#334155", style: 1, visible: true },
        horzLines: { color: "#334155", style: 1, visible: true },
      },
      crosshair: {
        mode: 0,
      },
      rightPriceScale: {
        borderColor: "#334155",
        textColor: "#9ca3af",
      },
      timeScale: {
        borderColor: "#334155",
        textColor: "#9ca3af",
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 10,
      },
      localization: {
        locale: "en-IN",
      },
    };

    const chart = createChart(chartContainerRef.current, chartOptions);
    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });
    candlestickSeriesRef.current = candlestickSeries;

    const IST_OFFSET_SECONDS = 5 * 3600 + 30 * 60;

    const formattedData = priceData.map((item) => {
      let timestamp = 0;

      if (item.timestamp_iso) {
        const timestampStr = String(item.timestamp_iso);
        const date = new Date(timestampStr);
        timestamp = Math.floor(date.getTime() / 1000);
      } else if (item.timestamp) {
        const date = new Date(item.timestamp);
        timestamp = Math.floor(date.getTime() / 1000);
      } else {
        const dateField = Object.keys(item).find(
          (key) =>
            key.toLowerCase().includes("date") ||
            key.toLowerCase().includes("time")
        );
        if (dateField) {
          const date = new Date(item[dateField]);
          timestamp = Math.floor(date.getTime() / 1000);
        }
      }

      const istTimestamp = timestamp + IST_OFFSET_SECONDS;

      return {
        time: istTimestamp,
        open: parseFloat(item.open) || 0,
        high: parseFloat(item.high) || 0,
        low: parseFloat(item.low) || 0,
        close: parseFloat(item.close) || 0,
      };
    });

    formattedData.sort((a, b) => a.time - b.time);

    candlestickSeries.setData(formattedData);

    const supportPrices = supportLevels
      ? supportLevels
          .map((s) => {
            const price = s.price || s.value || 0;
            return typeof price === "string" && price !== "N/A"
              ? parseFloat(price.replace(/[^0-9.]/g, ""))
              : parseFloat(price);
          })
          .filter((p) => p > 0 && !isNaN(p))
      : [];

    supportPrices.forEach((price, idx) => {
      const lineSeries = chart.addSeries(LineSeries, {
        color: "#16a34a",
        lineWidth: 2,
        lineStyle: 2,
      });
      const firstTime = formattedData[0]?.time;
      const lastTime = formattedData[formattedData.length - 1]?.time;
      if (firstTime && lastTime) {
        lineSeries.setData([
          { time: firstTime, value: price },
          { time: lastTime, value: price },
        ]);
      }
    });

    const resistancePrices = resistanceLevels
      ? resistanceLevels
          .map((r) => {
            const price = r.price || r.value || 0;
            return typeof price === "string" && price !== "N/A"
              ? parseFloat(price.replace(/[^0-9.]/g, ""))
              : parseFloat(price);
          })
          .filter((p) => p > 0 && !isNaN(p))
      : [];

    resistancePrices.forEach((price, idx) => {
      const lineSeries = chart.addSeries(LineSeries, {
        color: "#ea580c",
        lineWidth: 2,
        lineStyle: 2,
      });
      const firstTime = formattedData[0]?.time;
      const lastTime = formattedData[formattedData.length - 1]?.time;
      if (firstTime && lastTime) {
        lineSeries.setData([
          { time: firstTime, value: price },
          { time: lastTime, value: price },
        ]);
      }
    });

    chart.timeScale().fitContent();

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candlestickSeriesRef.current = null;
      }
    };
  }, [priceData, supportLevels, resistanceLevels]);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!priceData || priceData.length === 0) {
    return (
      <div
        style={{
          background: "#1a1f2e",
          padding: "40px",
          borderRadius: "12px",
          textAlign: "center",
          color: "#9ca3af",
        }}
      >
        No price data available
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#1a1f2e",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
      }}
    >
      <h2
        style={{
          color: "#fff",
          fontSize: "1.5em",
          marginBottom: "20px",
          fontWeight: 600,
        }}
      >
        Price Action Chart
      </h2>
      <div
        ref={chartContainerRef}
        style={{
          width: "100%",
          height: "500px",
          position: "relative",
        }}
      />
    </div>
  );
}
