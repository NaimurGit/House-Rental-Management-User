
const TransactionHistoryModal = ({
  type,
  apartment,
  transactions,
  onClose,
}) => {
  const isPayment = type === "payment";

  const formatCurrency = (amount) =>
    `৳${Number(amount).toLocaleString("en-BD")}`;

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const total = transactions.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">

        {/* Header */}
        <div className="flex justify-between items-start gap-3">
          <div>
            <h3 className="text-xl font-bold">
              {isPayment ? "Payment History" : "Spending History"}
            </h3>

            <p className="text-sm text-base-content/60 mt-1">
              {apartment.name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Total */}
        <div className="bg-base-200 rounded-lg p-4 mt-5 mb-5">
          <p className="text-sm text-base-content/60">
            Total {isPayment ? "Payments" : "Spendings"}
          </p>

          <h2 className="text-2xl font-bold mt-1">
            {formatCurrency(total)}
          </h2>

          <p className="text-xs text-base-content/50 mt-1">
            {transactions.length} record(s)
          </p>
        </div>

        {/* Transaction List */}
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table table-zebra">

              <thead>
                <tr>
                  <th>Date</th>
                  <th>{isPayment ? "Method" : "Category"}</th>
                  <th>Description</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((item) => (
                  <tr key={item.id}>
                    <td className="whitespace-nowrap">
                      {formatDate(item.date)}
                    </td>

                    <td>
                      {isPayment ? item.method : item.category}
                    </td>

                    <td className="max-w-40">
                      <span className="line-clamp-2">
                        {item.description || "-"}
                      </span>
                    </td>

                    <td className="text-right font-semibold whitespace-nowrap">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-base-content/50">
              No {isPayment ? "payments" : "spendings"} recorded yet.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="modal-action">
          <button onClick={onClose} className="btn btn-primary">
            Close
          </button>
        </div>

      </div>

      <button
        type="button"
        className="modal-backdrop"
        onClick={onClose}
        aria-label="Close modal"
      >
        Close
      </button>
    </div>
  );
};

export default TransactionHistoryModal;
