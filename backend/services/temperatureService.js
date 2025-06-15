/**
 * Generate random temperature data.
 * This function simulates a temperature sensor by generating random temperature and humidity values.
 * The temperature is in the range of 15 to 45 degrees Celsius, and humidity is in the range of 30% to 80%.
 * @returns {Object} An object containing temperature data.
 */
export function generateTemperatureData() {
  return {
    temperature: Math.round((Math.random() * (45 - 15) + 15) * 100) / 100,
    timestamp: new Date().toISOString(),
    humidity: Math.round((Math.random() * (80 - 30) + 30) * 100) / 100,
    location: "Sensor-001",
    unit: "°C",
  };
}
