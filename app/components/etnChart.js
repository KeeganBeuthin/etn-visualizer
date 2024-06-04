"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const EtnChart = () => {
  const [chartData, setChartData] = useState({ datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const symbols = ["DRIP", "GUSH"];
        const endDate = Math.floor(Date.now() / 1000);
        const startDate = endDate - 3 * 365 * 24 * 60 * 60;

        let markedPrices = [];
        let labels = [];

        const promises = symbols.map(async (symbol) => {
          const response = await axios.get(
            `/api/etn?symbol=${symbol}&start=${startDate}&end=${endDate}`
          );
          const rows = response.data.split("\n").slice(1);
          const data = rows
            .map((row) => {
              const [date, open, high, low, close, adjClose, volume] =
                row.split(",");
              return { date, close: parseFloat(close) };
            })
            .filter((entry) => !isNaN(entry.close));

          const prices = data.map((entry) => entry.close);
          const currentLabels = prices.map((_, index) => index);
          labels = labels.length > 0 ? labels : currentLabels;

          let initialPrice = prices[0];
          markedPrices.push({ x: 0, y: initialPrice, symbol });

          for (let i = 1; i < prices.length; i++) {
            if (prices[i] <= initialPrice * 0.9) {
              markedPrices.push({ x: i, y: prices[i], symbol });
              initialPrice = prices[i];
            }
          }

          return {
            label: `${symbol} Price`,
            data: prices,
            borderColor: "rgba(75,192,192,1)",
            fill: false,
          };
        });

        const datasets = await Promise.all(promises);

        const markedPricesDataset = {
          label: "Marked Prices",
          data: markedPrices,
          borderColor: "rgba(255, 0, 0, 1)",
          backgroundColor: "rgba(255, 0, 0, 1)",
          showLine: false,
          pointRadius: 5,
          pointHoverRadius: 8,
        };

        datasets.push(markedPricesDataset);

        setChartData({
          labels,
          datasets,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Line data={chartData} />
    </div>
  );
};

export default EtnChart;
