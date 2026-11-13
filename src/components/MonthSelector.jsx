
const months = [
  "January", "February", "March",
  "April", "May", "June",
  "July", "August", "September",
  "October", "November", "December"
];

function MonthSelector({ month, year, setMonth, setYear }) {
  return (
    <div className="flex items-center gap-2">

      <select
        className="select select-bordered"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      >
        {months.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <select
        className="select select-bordered"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      >
        {[2025, 2026, 2027, 2028].map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

    </div>
  );
}

export default MonthSelector;
