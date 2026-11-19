import { useEffect, useState } from "react";
import Head from "next/head";
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
  const [isLoading, setLoading] = useState(false);
  let labels = [];
  let content = [];

  useEffect(() => {
    setLoading(true);
    fetch("/api/")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading)
    return (
      <div
        className="d-flex justify-content-center align-items-center position-fixed bottom-50 start-50"
        style={{ transform: "translate(-50%,50%)" }}
      >
        <div
          className="spinner-border"
          style={{ width: "10rem", height: "10rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  if (!data)
    return (
      <div
        className="d-flex justify-content-center align-items-center position-fixed bottom-50 start-50"
        style={{ transform: "translate(-50%,50%)" }}
      >
        <h3>No Data</h3>
      </div>
    );

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
