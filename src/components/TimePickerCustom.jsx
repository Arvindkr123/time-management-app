/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const TimePickerCustom = ({ setAddClassTimeTableData }) => {
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [period, setPeriod] = useState("");

  useEffect(() => {
    const selectedTime = `${hour}:${minute} ${period}`;
    setAddClassTimeTableData((prev) => ({ ...prev, classTime: selectedTime }));
  }, [hour, minute, period, setAddClassTimeTableData]);

  return (
    <div>
      <label>Time:</label>
      <select
        className="h-8 p-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
        value={hour}
        onChange={(e) => setHour(e.target.value)}
      >
        {Array.from({ length: 12 }, (_, i) => (
          <option key={i} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>

      <select
        className="h-8 p-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
        value={minute}
        onChange={(e) => setMinute(e.target.value)}
      >
        {Array.from({ length: 60 }, (_, i) => (
          <option key={i} value={i < 10 ? `0${i}` : i}>
            {i < 10 ? `0${i}` : i}
          </option>
        ))}
      </select>

      <select
        className="h-8 p-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};

export default TimePickerCustom;
