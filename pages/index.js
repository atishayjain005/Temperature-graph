import { useEffect, useState } from "react";
import Link from "next/link";
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
        console.log("1", data, typeof data);
        console.log("2", JSON.stringify(data));
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
  console.log(data.data);
  return (
    <div>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <Link
            href="https://smiles.ai/in/v1/free-smile-assessment?utm_source=PPC&utm_medium=brand&utm_campaign=bangalore&utm_id=Search&gclid=CjwKCAjw-8qVBhANEiwAfjXLrhtBY1ieJUAT-Oo2FSooJnxFEAT9x9i50AInHt6kHJVXJ4H-ewvAvRoCwUoQAvD_BwE"
            passHref
          >
            <a className="navbar-brand fw-bold">Smiles.ai Assignment</a>
          </Link>
        </div>
      </nav>
      {console.log(dummyData)}
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
            <span className="text-danger  ">Weather Temperature</span> of last
            10 days
          </h1>
          <Line data={dummyData} width={200} height={90} options={options} />
        </div>
      </div>
    </div>
  );
}
