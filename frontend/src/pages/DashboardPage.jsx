import React, { useEffect, useState } from "react";
import axios from "axios";
import TemperatureChart from "../components/TemperatureChart";
import TemperatureList from "../components/TemperatureList";
import Navbar from "../components/Navbar";

const DashboardPage = () => {
  const [history, setHistory] = useState([]);

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

        setHistory((prev) => {
          const updated = [newData, ...prev];
          return updated.slice(0, 10);
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
    <>
      <Navbar />
      <div className="pt-20 min-h-screen flex flex-col items-center bg-gray-50 p-4 space-y-6">
        <div className="w-full max-w-4xl">
          <TemperatureChart data={history} unit={history[0]?.unit || "°C"} />
        </div>

        <TemperatureList data={history} />
      </div>
    </>
  );
};

export default DashboardPage;
