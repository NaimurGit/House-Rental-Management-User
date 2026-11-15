
import { FiCalendar } from "react-icons/fi";

const MonthSelector = ({
  month,
  setMonth,
  year,
  setYear,
}) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-base-100 rounded-2xl border border-base-200 shadow-sm p-3 sm:px-4 sm:py-2.5">

      <span className="hidden sm:flex items-center gap-2 text-sm font-semibold text-base-content/70">
        <FiCalendar className="text-primary" />
        Period
      </span>

      <div className="flex gap-3 flex-1">
        <select
          className="select select-bordered select-sm rounded-xl w-full sm:w-44 font-medium"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          aria-label="Select month"
        >
          {months.map((monthName, index) => (
            <option key={monthName} value={index}>
              {monthName}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered select-sm rounded-xl w-full sm:w-28 font-medium"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          aria-label="Select year"
        >
          {Array.from(
            { length: 11 },
            (_, index) => new Date().getFullYear() - 5 + index
          ).map((yearValue) => (
            <option key={yearValue} value={yearValue}>
              {yearValue}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MonthSelector;
