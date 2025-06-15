export function generateTemperatureData() {
  return {
    temperature: Math.round((Math.random() * (45 - 15) + 15) * 100) / 100,
    timestamp: new Date().toISOString(),
    humidity: Math.round((Math.random() * (80 - 30) + 30) * 100) / 100,
    location: "Sensor-001",
    unit: "°C",
  };
}
