
import ApartmentMenu from "./ApartmentMenu";

const ApartmentCard = ({
    apartment,
    onShowPayments,
    onAddPayment,
    onShowSpendings,
    onAddSpending,
    onEditCharges,
}) => {
    const {
        name,
        rent = 0,
        water = 0,
        garbage = 0,
        service = 0,
        due = 0,
        paid = 0,
        total = 0,
        remaining = 0,
        hasSpending = false,
        isRed = false,
    } = apartment;

    const formatCurrency = (amount) =>
        `৳${Number(amount || 0).toLocaleString("en-BD")}`;

    const cardStatus = isRed
        ? "border-error/40"
        : "border-success/40";

    const detailRows = [
        { label: "House Rent", value: rent },
        { label: "Water Bill", value: water },
        { label: "Garbage Bill", value: garbage },
        { label: "Service Charge", value: service },
    ];

    return (
        <div
            className={`card bg-base-100 border-2 ${cardStatus} rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex-1`}
        >
            <div className="card-body p-5">

                {/* Card Header */}
                <div className="flex justify-between items-start gap-3 mb-4">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h2 className="card-title text-lg font-bold truncate">
                                {name}
                            </h2>

                            <span
                                className={`badge badge-sm font-semibold ${
                                    isRed
                                        ? "badge-error"
                                        : "badge-success"
                                }`}
                            >
                                {isRed ? "Due" : "Paid"}
                            </span>
                        </div>

                        <p className="text-xs text-base-content/50 mt-1">
                            Monthly bill summary
                        </p>
                    </div>

                    <ApartmentMenu
                        onShowPayments={() => onShowPayments(apartment)}
                        onAddPayment={() => onAddPayment(apartment)}
                        onShowSpendings={() => onShowSpendings(apartment)}
                        onAddSpending={() => onAddSpending(apartment)}
                    />
                </div>

                {/* Monthly Charges Button */}
                <button
                    onClick={() => onEditCharges(apartment)}
                    className="btn btn-sm btn-outline btn-primary w-full rounded-xl"
                >
                    Edit Monthly Charges
                </button>

                <div className="divider my-1"></div>

                {/* Rent Details */}
                <div className="space-y-3">
                    {detailRows.map((row) => (
                        <div
                            key={row.label}
                            className="flex justify-between text-sm"
                        >
                            <span className="text-base-content/60">
                                {row.label}
                            </span>
                            <span className="font-medium">
                                {formatCurrency(row.value)}
                            </span>
                        </div>
                    ))}

                    {due > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-warning">
                                Previous Due
                            </span>
                            <span className="font-medium text-warning">
                                {formatCurrency(due)}
                            </span>
                        </div>
                    )}
                </div>

                <div className="divider my-1"></div>

                {/* Total Amount */}
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-base-content/70">
                        Total Amount
                    </span>

                    <span className="font-bold text-lg">
                        {formatCurrency(total)}
                    </span>
                </div>

                {/* Paid Amount */}
                <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-success font-medium">
                        Paid Amount
                    </span>

                    <span className="font-semibold text-success">
                        {formatCurrency(paid)}
                    </span>
                </div>

                {/* Remaining Amount */}
                <div
                    className={`flex justify-between items-center mt-3 p-3 rounded-xl ${
                        remaining > 0
                            ? "bg-error/10"
                            : "bg-success/10"
                    }`}
                >
                    <span className="font-semibold text-sm">
                        Remaining Due
                    </span>

                    <span
                        className={`font-bold ${
                            remaining > 0
                                ? "text-error"
                                : "text-success"
                        }`}
                    >
                        {formatCurrency(remaining)}
                    </span>
                </div>

                {/* Spending Status */}
                {hasSpending && (
                    <p className="text-xs text-error font-medium mt-2 flex items-center gap-1">
                        <span>⚠</span>
                        This apartment has spending in the selected month.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ApartmentCard;
