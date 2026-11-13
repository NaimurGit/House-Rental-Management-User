
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
    <div className="flex flex-wrap items-center gap-3">
      <select
        className="select select-bordered"
        value={month}
        onChange={(e) => setMonth(Number(e.target.value))}
      >
        {months.map((monthName, index) => (
          <option key={monthName} value={index}>
            {monthName}
          </option>
        ))}
      </select>

      <select
        className="select select-bordered"
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
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
  );
};

export default MonthSelector;
