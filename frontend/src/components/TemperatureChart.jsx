import React, { useEffect, useMemo, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const MAX_POINTS = 10;
const INTERVAL_MS = 2000; // 2 seconds

const TemperatureChart = ({ data, unit }) => {
  const chartRef = useRef(null);
  const [currentTime, setCurrentTime] = React.useState(Date.now());

  // Update current time every second to keep the grid aligned
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate fixed tick positions for the next 10 intervals
  const tickPositions = useMemo(() => {
    const positions = [];
    // Round down to the nearest interval
    const latestTick = Math.floor(currentTime / INTERVAL_MS) * INTERVAL_MS;
    // Generate 10 ticks going back in time
    for (let i = 0; i < MAX_POINTS; i++) {
      positions.unshift(latestTick - i * INTERVAL_MS);
    }
    return positions;
  }, [currentTime]);

  // Map data to the fixed time points, ensuring continuous line
  const chartData = useMemo(() => {
    console.log("Raw data:", data);
    if (!data || data.length === 0) return [];

    try {
      // Sort data by timestamp to ensure proper ordering
      const sortedData = [...data].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      const result = tickPositions.map((tick) => {
        // Find the closest point to this tick
        const closestPoint = sortedData.reduce((closest, point) => {
          const pointTime = new Date(point.timestamp).getTime();
          const diff = Math.abs(pointTime - tick);
          if (diff < INTERVAL_MS) {
            // Within one interval
            if (!closest || diff < closest.diff) {
              return { point, diff };
            }
          }
          return closest;
        }, null);

        return closestPoint
          ? [tick, closestPoint.point.temperature]
          : [tick, null];
      });

      console.log("Mapped chart data:", result);
      return result;
    } catch (error) {
      console.error("Error processing chart data:", error);
      return [];
    }
  }, [tickPositions, data]);

  const options = useMemo(
    () => ({
      chart: {
        type: "spline",
        animation: true,
        events: {
          load: function () {
            // Store the chart instance for later use
            if (chartRef.current) {
              chartRef.current.chart = this;
            }
          },
        },
      },
      title: {
        text: "Live Temperature Data",
      },
      xAxis: {
        type: "datetime",
        tickPositions: tickPositions,
        labels: {
          rotation: -45,
          formatter: function () {
            return Highcharts.dateFormat("%I:%M:%S %p", this.value);
          },
        },
        title: {
          text: "Time (newest → oldest)",
        },
        min: tickPositions[0],
        max: tickPositions[tickPositions.length - 1],
        tickInterval: INTERVAL_MS,
        gridLineWidth: 1,
      },
      yAxis: {
        title: {
          text: `Temperature (${unit})`,
        },
        min: 10,
        max: 50,
        startOnTick: false,
        endOnTick: false,
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        headerFormat: "<b>{point.x:%I:%M:%S %p}</b><br/>",
        pointFormat: "Temperature: {point.y:.1f}°C",
      },
      plotOptions: {
        spline: {
          lineWidth: 2,
          connectNulls: true, // Connect line across null values
          states: {
            hover: {
              lineWidth: 3,
            },
          },
          marker: {
            enabled: true, // Show markers to indicate data points
            radius: 3,
            lineWidth: 1,
            lineColor: "#666",
            fillColor: "white",
          },
          pointStart: tickPositions[0],
          pointInterval: INTERVAL_MS,
        },
      },
      series: [
        {
          name: "Temperature",
          data: chartData,
          animation: {
            duration: 500,
          },
        },
      ],
    }),
    [chartData, unit, tickPositions]
  );

  // Initialize and update chart
  useEffect(() => {
    if (!chartRef.current || !chartData.length) return;

    const chart = chartRef.current.chart;
    if (!chart) {
      console.log("Chart not yet initialized");
      return;
    }

    try {
      console.log("Updating chart with data:", chartData);
      if (chart.series && chart.series[0]) {
        // Update existing series
        chart.series[0].setData(chartData, true, false, { duration: 500 });
      } else {
        // Add new series if it doesn't exist
        chart.addSeries(
          {
            name: "Temperature",
            data: chartData,
            type: "spline",
            animation: { duration: 500 },
            marker: {
              enabled: true,
              radius: 3,
              lineWidth: 1,
              lineColor: "#666",
              fillColor: "white",
            },
          },
          true
        );
      }
    } catch (error) {
      console.error("Chart update error:", error);
    }
  }, [chartData]);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
  );
};

export default TemperatureChart;
