const TemperatureList = ({ data }) => (
  <div className="bg-white shadow rounded-xl p-6 w-full max-w-2xl">
    <h2 className="text-lg font-bold mb-4 text-gray-700">Latest Readings</h2>
    <ul className="space-y-2">
      {data.map((item, index) => (
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
);

export default TemperatureList;
