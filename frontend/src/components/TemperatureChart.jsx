import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const TemperatureChart = ({ data, unit }) => {
  if (!data || data.length === 0) return null;

  const reversedData = [...data].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  const temperatures = reversedData.map((d) => d.temperature);
  const timestamps = reversedData.map((d) => new Date(d.timestamp).getTime());

  // Generate series data with x=0 for newest, 1 for next, etc.
  const chartData = reversedData.map((d, i) => ({
    x: i,
    y: d.temperature,
    actualTime: new Date(d.timestamp).toLocaleTimeString(),
  }));

  const options = {
    chart: {
      type: "line",
      animation: true,
    },
    title: {
      text: "Live Temperature Data",
    },
    xAxis: {
      title: { text: "Time (newest → oldest)" },
      tickInterval: 1,
      categories: chartData.map((d) => d.actualTime),
      labels: {
        rotation: -45,
      },
    },
    yAxis: {
      title: { text: `Temperature (${unit})` },
      plotLines: [
        {
          value: Math.max(...temperatures),
          color: "red",
          dashStyle: "Dot",
          width: 2,
          label: { text: "Max", align: "right", style: { color: "red" } },
        },
        {
          value: Math.min(...temperatures),
          color: "blue",
          dashStyle: "Dot",
          width: 2,
          label: { text: "Min", align: "right", style: { color: "blue" } },
        },
        {
          value:
            temperatures.reduce((sum, val) => sum + val, 0) /
            temperatures.length,
          color: "green",
          dashStyle: "Dot",
          width: 2,
          label: { text: "Avg", align: "right", style: { color: "green" } },
        },
      ],
    },
    series: [
      {
        name: "Temperature",
        data: chartData.map((point) => point.y),
      },
    ],
    plotOptions: {
      series: {
        marker: {
          enabled: true,
        },
      },
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default TemperatureChart;
