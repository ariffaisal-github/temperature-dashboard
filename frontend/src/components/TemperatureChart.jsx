import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const TemperatureChart = ({ data, unit }) => {
  const temperatures = data.map((d) => d.temperature);

  const options = {
    title: { text: "Live Temperature Data" },
    xAxis: {
      type: "datetime",
      title: { text: "Time" },
    },
    yAxis: {
      title: { text: `Temperature (${unit})` },
      plotLines: [
        {
          value: Math.max(...temperatures),
          color: "red",
          dashStyle: "Dot", // or "Solid", "Dot", "DashDot", "LongDashDot", "LongDashDotDot"
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
        data: data.map((d) => [new Date(d.timestamp).getTime(), d.temperature]),
      },
    ],
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default TemperatureChart;
