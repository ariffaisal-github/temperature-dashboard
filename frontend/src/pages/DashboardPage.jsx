import React, { useEffect, useState } from "react";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const DashboardPage = () => {
  const [temperatureData, setTemperatureData] = useState(null);
  const [history, setHistory] = useState([]);
  const [chartOptions, setChartOptions] = useState({
    title: {
      text: "Live Temperature Data",
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Time",
      },
    },
    yAxis: {
      title: {
        text: "Temperature (°C)",
      },
    },
    series: [
      {
        name: "Temperature",
        data: [],
      },
    ],
    chart: {
      animation: true,
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchTemperature = async () => {
      try {
        const res = await axios.get(
          `http://localhost:${
            import.meta.env.VITE_NGINX_PORT || 8080
          }/api/temperature`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const newData = res.data;
        setTemperatureData(newData);

        setHistory((prev) => {
          const updated = [newData, ...prev];
          return updated.length > 20 ? updated.slice(0, 20) : updated;
        });

        setChartOptions((prevOptions) => {
          const updatedData = [
            ...prevOptions.series[0].data,
            [new Date(newData.timestamp).getTime(), newData.temperature],
          ];
          return {
            ...prevOptions,
            yAxis: {
              title: {
                text: `Temperature (${newData.unit})`,
              },
            },
            series: [
              {
                name: "Temperature",
                data:
                  updatedData.length > 20
                    ? updatedData.slice(updatedData.length - 20)
                    : updatedData,
              },
            ],
          };
        });
      } catch (error) {
        console.error("Error fetching temperature:", error);
      }
    };

    fetchTemperature();
    const interval = setInterval(fetchTemperature, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Temperature Dashboard
      </h1>

      <div className="w-full max-w-4xl mb-6">
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>

      <div className="bg-white shadow rounded-xl p-6 w-full max-w-2xl">
        <h2 className="text-lg font-bold mb-4 text-gray-700">
          Latest Readings
        </h2>
        <ul className="space-y-2">
          {history.map((item, index) => (
            <li
              key={index}
              className="flex justify-between text-sm text-gray-600 border-b pb-1"
            >
              <span>{new Date(item.timestamp).toLocaleString()}</span>
              <span>
                {item.temperature} {item.unit}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
