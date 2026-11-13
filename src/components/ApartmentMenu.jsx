
const ApartmentMenu = ({
  onShowPayments,
  onAddPayment,
  onShowSpendings,
  onAddSpending,
}) => {
  return (
    <div className="dropdown dropdown-end">
      <button
        tabIndex={0}
        className="btn btn-circle btn-outline btn-sm"
        aria-label="Apartment menu"
      >
        <span className="text-xl font-bold">⋮</span>
      </button>

      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-50 mt-2 w-60 p-2 shadow-lg border border-base-200"
      >
        <li>
          <button onClick={onShowPayments}>
            <span className="text-xl">☷</span>
            Show payments
          </button>
        </li>

        <li>
          <button onClick={onAddPayment}>
            <span className="text-2xl">＋</span>
            Add payment
          </button>
        </li>

        <li>
          <button
            onClick={onShowSpendings}
            className="text-base-content/40"
          >
            <span className="text-xl">▣</span>
            Show spendings
          </button>
        </li>

        <li>
          <button onClick={onAddSpending}>
            <span className="text-2xl">−</span>
            Add spending
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ApartmentMenu;
