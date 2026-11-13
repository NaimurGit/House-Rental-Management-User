
function Summary({ payments, spendings, due }) {
    const formatCurrency = (amount) =>
        `৳${Number(amount || 0).toLocaleString("en-BD")}`;

    return (
        <div className="flex flex-wrap gap-x-6 gap-y-2 my-7 text-lg">

            <p className="text-base-content/70">
                Payments{" "}
                <span className="font-bold text-base-content">
                    {formatCurrency(payments)}
                </span>
            </p>

            <p className="text-base-content/70">
                Spendings{" "}
                <span className="font-bold text-base-content">
                    {formatCurrency(spendings)}
                </span>
            </p>

            <p className="text-base-content/70">
                Due{" "}
                <span className="font-bold text-error">
                    {formatCurrency(due)}
                </span>
            </p>

        </div>
    );
}

export default Summary;
