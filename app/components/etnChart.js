'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const EtnChart = () => {
  const [chartData, setChartData] = useState({ datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const symbol = 'DRIP';
        const endDate = Math.floor(Date.now() / 1000);
        const startDate = endDate - (3 * 365 * 24 * 60 * 60);
        const response = await axios.get(`/api/etn?symbol=${symbol}&start=${startDate}&end=${endDate}`);
        const rows = response.data.split('\n').slice(1);
        const data = rows.map(row => {
          const [date, open, high, low, close, adjClose, volume] = row.split(',');
          return { date, close: parseFloat(close) };
        }).filter(entry => !isNaN(entry.close));

        const prices = data.map(entry => entry.close);

        setChartData({
          labels: prices.map((_, index) => index), // Use index as labels
          datasets: [
            {
              label: 'ETN Price',
              data: prices,
              borderColor: 'rgba(75,192,192,1)',
              fill: false,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>ETN Price for the Past 3 Years</h2>
      <Line data={chartData} />
    </div>
  );
};

export default EtnChart;