import { useEffect, useState } from "react";
import Head from "next/head";
import { parseSample } from "../lib/temperature.cjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  Tooltip,
  Filler
);

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
  elements: {
    line: {
      tension: 0,
      borderWidth: 3,
      borderColor: "blue",
      fill: "start",
      backgroundColor: "white",
    },
    point: {
      radius: 0,
      hitRadius: 0,
    },
  },
  scales: {
    xAxis: {
      display: true,
    },
    yAxis: {
      display: true,
    },
  },
};

export default function Home() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  let labels = [];
  let content = [];

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    let timedOut = false;
    setLoading(true);
    setError('');
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, 10000);
    async function load() {
      try {
        const response = await fetch('/api/', { signal: controller.signal });
        if (!response.ok) throw new Error('Temperature data could not be loaded.');
        const result = parseSample(await response.json());
        if (active) setData(result);
      } catch (error) {
        if (active) setError(timedOut ? 'The request timed out. Please try again.' : 'Temperature data could not be loaded. Please try again.');
      } finally {
        clearTimeout(timer);
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; clearTimeout(timer); controller.abort(); };
  }, [attempt]);

  if (isLoading || error || !data || data.data.length === 0) {
    return (
      <main className="container py-5">
        <Head><title>Temperature Graph · Sample data</title></Head>
        <h1>Temperature Graph</h1>
        <p>Generated sample data, not observed weather. Temperatures in °C; dates in UTC.</p>
        {isLoading ? <p role="status">Loading sample temperatures…</p> : <>
          {error ? <p role="alert">{error}</p> : <p role="status">No temperature samples available.</p>}
          <button type="button" className="btn btn-primary" onClick={() => setAttempt(value => value + 1)}>Try again</button>
        </>}
      </main>
    );
  }

  data.data.map((dummyData) => {
    const date = new Date(dummyData.date);

    labels.push(
      date.toLocaleDateString([], {
        month: "2-digit",
        day: "2-digit",
        timeZone: "UTC",
      })
    );
    content.push(dummyData.temperature);
  });

  const dummyData = {
    labels: labels,
    datasets: [
      {
        data: content,
      },
    ],
  };
  return (
    <div>
      <Head><title>Temperature Graph · Sample data</title><meta name="description" content="A temperature chart demo using generated sample values, not observed weather." /></Head>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">Temperature Graph</span>
        </div>
      </nav>
      <div className="container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
            flexBasis: "100%",
            height: "calc(100vh - 56px)",
          }}
        >
          <h1 className="fw-bold">
            Sample temperatures over 10 days
          </h1>
          <p>Generated sample data, not observed weather. Temperatures in °C; dates in UTC.</p>
          <Line data={dummyData} width={200} height={90} options={options} />
        </div>
      </div>
    </div>
  );
}
