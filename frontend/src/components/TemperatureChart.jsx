import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const TemperatureChart = ({ data, unit }) => {
  const temperatures = data.map((d) => d.temperature);
  const timestamps = data.map((d) => new Date(d.timestamp).getTime());

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
          dashStyle: "ShortDash",
          width: 2,
          label: { text: "Max", align: "right", style: { color: "red" } },
        },
        {
          value: Math.min(...temperatures),
          color: "blue",
          dashStyle: "ShortDash",
          width: 2,
          label: { text: "Min", align: "right", style: { color: "blue" } },
        },
        {
          value: temperatures.reduce((a, b) => a + b, 0) / temperatures.length,
          color: "green",
          dashStyle: "ShortDash",
          width: 2,
          label: { text: "Avg", align: "right", style: { color: "green" } },
        },
      ],
    },
    chart: { animation: true },
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
