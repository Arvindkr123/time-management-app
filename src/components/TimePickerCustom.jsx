/* eslint-disable react/prop-types */
import { useState } from "react";

const TimePickerCustom = ({ onChange }) => {
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");

  const handleTimeChange = () => {
    const selectedTime = `${hour}:${minute} ${period}`;
    onChange(selectedTime);
  };

  return (
    <div>
      <label>Time:</label>
      <select
        className="h-8 p-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
        value={hour}
        onChange={(e) => {
          setHour(e.target.value);
          handleTimeChange();
        }}
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
        onChange={(e) => {
          setMinute(e.target.value);
          handleTimeChange();
        }}
      >
        {Array.from({ length: 61 }, (_, i) => (
          <option key={i} value={i < 10 ? `0${i}` : i}>
            {i < 10 ? `0${i}` : i}
          </option>
        ))}
      </select>

      <select
        className="h-8 p-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
        value={period}
        onChange={(e) => {
          setPeriod(e.target.value);
          handleTimeChange();
        }}
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};

// const App = () => {
//   const timeSelectHandler = (selectedTime) => {
//     console.log("Selected Time:", selectedTime);
//   };

//   return (
//     <div>
//       <TimePicker onChange={timeSelectHandler} />
//     </div>
//   );
// };

export default TimePickerCustom;
