import React, { useContext, useEffect, useState, useCallback } from "react";
import Chart from "react-apexcharts";
import AuthContext from "../AuthContext";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

// Doughnut chart dummy data
export const data = {
  labels: ["Apple", "Knorr", "Shoop", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [0, 1, 5, 8, 9, 15],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

function Dashboard() {
  const [saleAmount, setSaleAmount] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const authContext = useContext(AuthContext);

  const [chart, setChart] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
    },
    series: [
      {
        name: "Monthly Sales Amount",
        data: [10, 20, 40, 50, 60, 20, 10, 35, 45, 70, 25, 70],
      },
    ],
  });

  const updateChartData = useCallback((salesData) => {
    setChart((prevChart) => ({
      ...prevChart,
      series: [
        {
          name: "Monthly Sales Amount",
          data: [...salesData],
        },
      ],
    }));
  }, []);

  const fetchTotalSaleAmount = useCallback(() => {
    fetch(
      `http://localhost:4000/api/sales/get/${authContext.user}/totalsaleamount`
    )
      .then((response) => response.json())
      .then((data) => setSaleAmount(data.totalSaleAmount));
  }, [authContext.user]);

  const fetchTotalPurchaseAmount = useCallback(() => {
    fetch(
      `http://localhost:4000/api/purchase/get/${authContext.user}/totalpurchaseamount`
    )
      .then((response) => response.json())
      .then((data) => setPurchaseAmount(data.totalPurchaseAmount));
  }, [authContext.user]);

  const fetchStoresData = useCallback(() => {
    fetch(`http://localhost:4000/api/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => setStores(data));
  }, [authContext.user]);

  const fetchProductsData = useCallback(() => {
    fetch(`http://localhost:4000/api/product/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, [authContext.user]);

  const fetchMonthlySalesData = useCallback(() => {
    fetch(`http://localhost:4000/api/sales/getmonthly`)
      .then((response) => response.json())
      .then((data) => updateChartData(data.salesAmount))
      .catch((err) => console.error(err));
  }, [updateChartData]);

  useEffect(() => {
    fetchTotalSaleAmount();
    fetchTotalPurchaseAmount();
    fetchStoresData();
    fetchProductsData();
    fetchMonthlySalesData();
  }, [
    fetchTotalSaleAmount,
    fetchTotalPurchaseAmount,
    fetchStoresData,
    fetchProductsData,
    fetchMonthlySalesData,
  ]);

  return (
    <div className="grid grid-cols-1 col-span-12 lg:col-span-10 gap-6 md:grid-cols-3 lg:grid-cols-4 p-4">
      {/* Sales Card */}
      <Card title="Sales" amount={saleAmount} growth="67.81%" color="green" />

      {/* Purchase Card */}
      <Card
        title="Purchase"
        amount={purchaseAmount}
        growth="67.81%"
        color="red"
      />

      {/* Product Count */}
      <Card title="Total Products" amount={products.length} growth="67.81%" color="red" />

      {/* Store Count */}
      <Card title="Total Stores" amount={stores.length} growth="67.81%" color="red" />

      {/* Charts */}
      <div className="flex justify-around bg-white rounded-lg py-8 col-span-full">
        <Chart options={chart.options} series={chart.series} type="bar" width="500" />
        <Doughnut data={data} />
      </div>
    </div>
  );
}

// Reusable Card Component
function Card({ title, amount, growth, color }) {
  return (
    <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
      <div className={`inline-flex gap-2 self-end rounded bg-${color}-100 p-1 text-${color}-600`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
        <span className="text-xs font-medium">{growth}</span>
      </div>
      <div>
        <strong className="block text-sm font-medium text-gray-500">
          {title}
        </strong>
        <p>
          <span className="text-2xl font-medium text-gray-900">
            {typeof amount === "number" ? `$${amount}` : amount}
          </span>
        </p>
      </div>
    </article>
  );
}

export default Dashboard;
