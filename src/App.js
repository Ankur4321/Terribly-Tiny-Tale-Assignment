import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { saveAs } from 'file-saver';

const API_URL = 'https://www.terriblytinytales.com/test.txt';

function App() {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      const words = response.data.trim().split(/\s+/);
      const frequencyMap = new Map();

      words.forEach((word) => {
        const count = frequencyMap.get(word) || 0;
        frequencyMap.set(word, count + 1);
      });

      const sortedData = Array.from(frequencyMap.entries()).sort(
        (a, b) => b[1] - a[1]
      );

      const top20Data = sortedData.slice(0, 20);
      const chartData = top20Data.map((entry) => ({
        word: entry[0],
        frequency: entry[1],
      }));

      setData(top20Data);
      setChartData(chartData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleExport = () => {
    const csvContent = data.map((entry) => `${entry[0]},${entry[1]}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'word_frequency.csv');
  };

  return (
    <div className="App">
      <h1>Word Frequency</h1>
      <button onClick={fetchData}>Submit</button>
      {chartData && (
        <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
          <BarChart width={600} height={400} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="word" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="frequency" fill="rgba(75,192,192,0.6)" />
          </BarChart>
        </div>
      )}
      {data.length > 0 && <button onClick={handleExport}>Export</button>}
    </div>
  );
}

export default App;
