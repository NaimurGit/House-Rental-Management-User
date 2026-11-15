
import {
    FiTrendingUp,
    FiTrendingDown,
    FiAlertCircle,
} from "react-icons/fi";

function Summary({ payments, spendings, due }) {
    const formatCurrency = (amount) =>
        `৳${Number(amount || 0).toLocaleString("en-BD")}`;

    const cards = [
        {
            label: "Total Payments",
            value: payments,
            icon: <FiTrendingUp />,
            gradient: "from-emerald-500 to-teal-500",
        },
        {
            label: "Total Spendings",
            value: spendings,
            icon: <FiTrendingDown />,
            gradient: "from-amber-500 to-orange-500",
        },
        {
            label: "Remaining Due",
            value: due,
            icon: <FiAlertCircle />,
            gradient: "from-rose-500 to-red-500",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">

            {cards.map((card) => (
                <div
                    key={card.label}
                    className="card bg-base-100 rounded-2xl border border-base-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                    <div className="card-body p-5 flex-row items-center gap-4">

                        <div
                            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} text-white flex items-center justify-center text-xl shadow-md shrink-0`}
                        >
                            {card.icon}
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs uppercase tracking-wide font-semibold text-base-content/50">
                                {card.label}
                            </p>

                            <p className="text-xl sm:text-2xl font-bold mt-0.5 truncate">
                                {formatCurrency(card.value)}
                            </p>
                        </div>

                    </div>
                </div>
            ))}

        </div>
    );
}

export default Summary;
