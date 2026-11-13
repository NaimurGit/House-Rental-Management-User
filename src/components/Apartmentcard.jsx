
import ApartmentMenu from "./ApartmentMenu";

const ApartmentCard = ({
    apartment,
    onShowPayments,
    onAddPayment,
    onShowSpendings,
    onAddSpending,
}) => {
    const {
        name,
        rent = 0,
        water = 0,
        garbage = 0,
        service = 0,
        due = 0,
        paid = 0,
    } = apartment;

    const total = rent + water + garbage + service + due;
    const remaining = Math.max(total - paid, 0);

    const formatCurrency = (amount) =>
        `৳${Number(amount).toLocaleString("en-BD")}`;

    return (
        <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
            <div className="card-body p-5">

                {/* Card Header */}
                <div className="flex justify-between items-center mb-3">
                    <div>
                        <h2 className="card-title text-lg font-semibold">
                            {name}
                        </h2>
                        <p className="text-xs text-base-content/50">
                            Apartment details
                        </p>
                    </div>

                    {/* Three-dot Menu */}
                    <ApartmentMenu
                        onShowPayments={() => onShowPayments(apartment)}
                        onAddPayment={() => onAddPayment(apartment)}
                        onShowSpendings={() => onShowSpendings(apartment)}
                        onAddSpending={() => onAddSpending(apartment)}
                    />
                </div>

                <div className="divider my-1"></div>

                {/* Rent Details */}
                <div className="space-y-3">

                    <div className="flex justify-between text-sm">
                        <span className="text-base-content/60">House Rent</span>
                        <span className="font-medium">{formatCurrency(rent)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-base-content/60">Water Bill</span>
                        <span className="font-medium">{formatCurrency(water)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-base-content/60">Garbage Bill</span>
                        <span className="font-medium">{formatCurrency(garbage)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-base-content/60">Service Charge</span>
                        <span className="font-medium">{formatCurrency(service)}</span>
                    </div>

                    {due > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-warning">Previous Due</span>
                            <span className="font-medium text-warning">
                                {formatCurrency(due)}
                            </span>
                        </div>
                    )}

                </div>

                <div className="divider my-1"></div>

                {/* Total Amount */}
                <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Amount</span>
                    <span className="font-bold text-lg">
                        {formatCurrency(total)}
                    </span>
                </div>

                {/* Paid Amount */}
                <div className="flex justify-between items-center text-sm">
                    <span className="text-success">Paid Amount</span>
                    <span className="font-semibold text-success">
                        {formatCurrency(paid)}
                    </span>
                </div>

                {/* Remaining Amount */}
                <div className="flex justify-between items-center mt-2 p-3 rounded-lg bg-base-200">
                    <span className="font-semibold text-sm">
                        Remaining Due
                    </span>

                    <span className={`font-bold ${remaining > 0 ? "text-error" : "text-success"}`}>
                        {formatCurrency(remaining)}
                    </span>
                </div>

            </div>
        </div>
    );
};

export default ApartmentCard;
