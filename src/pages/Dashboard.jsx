
import { useEffect, useState } from "react";

import {
    getApartments,
    createApartment,
    updateApartment,
    deleteApartment,
} from "../api/apartmentApi";

import {
    getPayments,
    createPayment,
} from "../api/paymentApi";

import {
    getSpendings,
    createSpending,
} from "../api/spendingApi";

import {
    getMonthlyCharges,
    saveMonthlyCharge,
} from "../api/monthlyChargeApi";

import {
    showSuccess,
    showError,
    showConfirm,
} from "../utils/swal";

import Navbar from "../components/Navbar";
import ApartmentCard from "../components/Apartmentcard";
import ApartmentModal from "../components/ApartmentModal";
import Summary from "../components/Summary";
import MonthSelector from "../components/MonthSelector";
import TransactionModal from "../components/Transactionmodal";
import TransactionHistoryModal from "../components/TransactionHistoryModal";
import MonthlyChargeModal from "../components/MonthlyChargeModal";

const Dashboard = () => {
    // =====================================
    // 1. APARTMENT DATA
    // =====================================

    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const sortApartments = (items) => {
        return [...items].sort((a, b) =>
            a.name.localeCompare(b.name, undefined, {
                numeric: true,
                sensitivity: "base",
            })
        );
    };

    useEffect(() => {
        const fetchApartments = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getApartments();

                const formattedApartments = data.apartments.map(
                    (apartment) => ({
                        ...apartment,
                        id: apartment._id,
                    })
                );

                setApartments(sortApartments(formattedApartments));
            } catch (error) {
                console.error("Fetch apartments error:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load apartments. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchApartments();
    }, []);

    // =====================================
    // 2. PAYMENT AND SPENDING DATA
    // =====================================

    const [payments, setPayments] = useState([]);
    const [spendings, setSpendings] = useState([]);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const data = await getPayments();

                const formattedPayments = data.payments.map((payment) => ({
                    id: payment._id,
                    apartmentId: payment.apartment?._id,
                    apartmentName:
                        payment.apartment?.name || "Unknown Apartment",
                    amount: Number(payment.amount),
                    date: payment.date?.slice(0, 10),
                    description: payment.description || "",
                    method: payment.method,
                }));

                setPayments(formattedPayments);
            } catch (error) {
                console.error("Fetch payments error:", error);
            }
        };

        fetchPayments();
    }, []);

    useEffect(() => {
        const fetchSpendings = async () => {
            try {
                const data = await getSpendings();

                const formattedSpendings = data.spendings.map((spending) => ({
                    id: spending._id,
                    apartmentId: spending.apartment?._id,
                    apartmentName:
                        spending.apartment?.name || "Unknown Apartment",
                    amount: Number(spending.amount),
                    date: spending.date?.slice(0, 10),
                    description: spending.description || "",
                    category: spending.category,
                }));

                setSpendings(formattedSpendings);
            } catch (error) {
                console.error("Fetch spendings error:", error);
            }
        };

        fetchSpendings();
    }, []);

    // =====================================
    // 3. MONTH AND YEAR
    // =====================================

    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    // =====================================
    // 4. MONTHLY CHARGES
    // =====================================

    const [monthlyCharges, setMonthlyCharges] = useState([]);
    const [isChargeLoading, setIsChargeLoading] = useState(false);

    const refreshMonthlyCharges = async () => {
        const data = await getMonthlyCharges(month, year);

        setMonthlyCharges(data.monthlyCharges || []);
    };

    useEffect(() => {
        const fetchMonthlyCharges = async () => {
            try {
                setIsChargeLoading(true);

                const data = await getMonthlyCharges(month, year);

                setMonthlyCharges(data.monthlyCharges || []);
            } catch (error) {
                console.error("Fetch monthly charges error:", error);

                showError(
                    error.response?.data?.message ||
                    "Failed to load monthly charges."
                );
            } finally {
                setIsChargeLoading(false);
            }
        };

        fetchMonthlyCharges();
    }, [month, year, apartments.length]);

    // =====================================
    // 5. APARTMENT MODAL STATES
    // =====================================

    const [isApartmentModalOpen, setIsApartmentModalOpen] = useState(false);
    const [selectedApartment, setSelectedApartment] = useState(null);

    // =====================================
    // 6. MONTHLY CHARGE MODAL STATES
    // =====================================

    const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);
    const [selectedCharge, setSelectedCharge] = useState(null);

    const handleEditCharges = (apartment) => {
        const charge = monthlyCharges.find(
            (item) => item.apartmentId === apartment.id
        );

        setSelectedApartment(apartment);
        setSelectedCharge(charge || null);
        setIsChargeModalOpen(true);
    };

    const handleSaveMonthlyCharge = async (chargeData) => {
        try {
            await saveMonthlyCharge(chargeData);

            await refreshMonthlyCharges();

            setIsChargeModalOpen(false);
            setSelectedApartment(null);
            setSelectedCharge(null);

            await showSuccess("Monthly charges saved successfully!");
        } catch (error) {
            console.error("Save monthly charge error:", error);

            showError(
                error.response?.data?.message ||
                "Failed to save monthly charges."
            );

            throw error;
        }
    };

    // =====================================
    // 7. TRANSACTION MODAL STATES
    // =====================================

    const [isTransactionModalOpen, setIsTransactionModalOpen] =
        useState(false);

    const [transactionType, setTransactionType] = useState("payment");

    // =====================================
    // 8. HISTORY MODAL STATES
    // =====================================

    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [historyType, setHistoryType] = useState("payment");

    // =====================================
    // 9. DATE HELPERS
    // =====================================

    const isSelectedMonth = (date) => {
        if (!date) return false;

        const transactionDate = new Date(`${date}T00:00:00`);

        return (
            transactionDate.getMonth() === month &&
            transactionDate.getFullYear() === year
        );
    };

    const isBeforeSelectedMonth = (date) => {
        if (!date) return false;

        const transactionDate = new Date(`${date}T00:00:00`);
        const selectedDate = new Date(year, month, 1);

        return transactionDate < selectedDate;
    };

    // =====================================
    // 10. SELECTED MONTH TRANSACTIONS
    // =====================================

    const selectedMonthPayments = payments.filter((payment) =>
        isSelectedMonth(payment.date)
    );

    const selectedMonthSpendings = spendings.filter((spending) =>
        isSelectedMonth(spending.date)
    );

    // =====================================
    // 11. CALCULATE APARTMENT FINANCIAL DATA
    // =====================================

    const getApartmentFinancialData = (apartment) => {
        const monthlyCharge = monthlyCharges.find(
            (item) => item.apartmentId === apartment.id
        );

        const rent = Number(monthlyCharge?.rent || 0);
        const water = Number(monthlyCharge?.water || 0);
        const garbage = Number(monthlyCharge?.garbage || 0);
        const service = Number(monthlyCharge?.service || 0);

        const currentMonthTotal = rent + water + garbage + service;

        // Previous months' charges
        const previousCharges = Number(
            monthlyCharge?.previousCharges || 0
        );

        // Previous months' payments
        const previousPayments = payments
            .filter(
                (payment) =>
                    payment.apartmentId === apartment.id &&
                    isBeforeSelectedMonth(payment.date)
            )
            .reduce(
                (sum, payment) => sum + Number(payment.amount || 0),
                0
            );

        // Previous unpaid amount
        const previousDue = Math.max(
            previousCharges - previousPayments,
            0
        );

        // Selected month's payments
        const paid = selectedMonthPayments
            .filter((payment) => payment.apartmentId === apartment.id)
            .reduce(
                (sum, payment) => sum + Number(payment.amount || 0),
                0
            );

        // Current charges + previous due
        const total = currentMonthTotal + previousDue;

        const remaining = Math.max(total - paid, 0);

        // Check selected month spending
        const hasSpending = selectedMonthSpendings.some(
            (spending) => spending.apartmentId === apartment.id
        );

        return {
            ...apartment,
            rent,
            water,
            garbage,
            service,
            due: previousDue,
            paid,
            total,
            remaining,
            hasSpending,
            isRed: remaining > 0 || hasSpending,
        };
    };

    const apartmentsWithFinancialData = apartments.map(
        getApartmentFinancialData
    );

    // =====================================
    // 12. DASHBOARD SUMMARY
    // =====================================

    const totalPayments = selectedMonthPayments.reduce(
        (sum, payment) => sum + Number(payment.amount || 0),
        0
    );

    const totalSpendings = selectedMonthSpendings.reduce(
        (sum, spending) => sum + Number(spending.amount || 0),
        0
    );

    const totalDue = apartmentsWithFinancialData.reduce(
        (sum, apartment) => sum + apartment.remaining,
        0
    );

    // =====================================
    // 13. ADD APARTMENT
    // =====================================

    const handleAddApartment = () => {
        setSelectedApartment(null);
        setIsApartmentModalOpen(true);
    };

    // =====================================
    // 14. EDIT APARTMENT
    // =====================================

    const handleEditApartment = (apartment) => {
        setSelectedApartment(apartment);
        setIsApartmentModalOpen(true);
    };

    // =====================================
    // 15. CREATE / UPDATE APARTMENT
    // =====================================

    const handleSaveApartment = async (apartmentData) => {
        let apartmentId;

        try {
            if (selectedApartment) {
                // Update existing apartment
                const data = await updateApartment(
                    selectedApartment.id,
                    apartmentData
                );

                apartmentId = selectedApartment.id;

                const updatedApartment = {
                    ...data.apartment,
                    id: data.apartment._id,
                };

                setApartments((previousApartments) =>
                    sortApartments(
                        previousApartments.map((apartment) =>
                            apartment.id === selectedApartment.id
                                ? {
                                    ...apartment,
                                    ...updatedApartment,
                                }
                                : apartment
                        )
                    )
                );
            } else {
                // Create new apartment
                const data = await createApartment(apartmentData);

                apartmentId = data.apartment._id;

                const newApartment = {
                    ...data.apartment,
                    id: data.apartment._id,
                };

                setApartments((previousApartments) =>
                    sortApartments([...previousApartments, newApartment])
                );
            }

            // SAVE ALL FOUR BILLS TO MONTHLY CHARGES

            await saveMonthlyCharge({
                apartmentId,
                month,
                year,
                rent: Number(apartmentData.rent || 0),
                water: Number(apartmentData.water || 0),
                garbage: Number(apartmentData.garbage || 0),
                service: Number(apartmentData.service || 0),
            });

            // Refresh selected month's charges
            await refreshMonthlyCharges();

            setIsApartmentModalOpen(false);
            setSelectedApartment(null);

            await showSuccess(
                selectedApartment
                    ? "Apartment and monthly charges updated successfully!"
                    : "Apartment and monthly charges added successfully!"
            );

        } catch (error) {
            console.error("Save apartment error:", error);

            // If creating the apartment succeeded but saving its
            // monthly charges failed, try to remove the new apartment.
            if (!selectedApartment && apartmentId) {
                try {
                    await deleteApartment(apartmentId);

                    setApartments((previousApartments) =>
                        previousApartments.filter(
                            (item) => item.id !== apartmentId
                        )
                    );
                } catch (deleteError) {
                    console.error(
                        "Could not roll back apartment creation:",
                        deleteError
                    );
                }
            }

            showError(
                error.response?.data?.message ||
                "Failed to save apartment or monthly charges. Please try again."
            );

            throw error;
        }
    };

    // =====================================
    // 16. DELETE APARTMENT
    // =====================================

    const handleDeleteApartment = async (apartment) => {
        const result = await showConfirm(
            `Are you sure you want to delete ${apartment.name}? Its payment and spending history may also become disconnected.`
        );

        if (!result.isConfirmed) return;

        try {
            await deleteApartment(apartment.id);

            setApartments((previousApartments) =>
                previousApartments.filter(
                    (item) => item.id !== apartment.id
                )
            );

            setPayments((previousPayments) =>
                previousPayments.filter(
                    (item) => item.apartmentId !== apartment.id
                )
            );

            setSpendings((previousSpendings) =>
                previousSpendings.filter(
                    (item) => item.apartmentId !== apartment.id
                )
            );

            setMonthlyCharges((previousCharges) =>
                previousCharges.filter(
                    (item) => item.apartmentId !== apartment.id
                )
            );

            await showSuccess("Apartment deleted successfully!");

        } catch (error) {
            console.error("Delete apartment error:", error);

            showError(
                error.response?.data?.message ||
                "Failed to delete apartment."
            );
        }
    };

    // =====================================
    // 17. ADD PAYMENT
    // =====================================

    const handleAddPayment = (apartment) => {
        setSelectedApartment(apartment);
        setTransactionType("payment");
        setIsTransactionModalOpen(true);
    };

    // =====================================
    // 18. ADD SPENDING
    // =====================================

    const handleAddSpending = (apartment) => {
        setSelectedApartment(apartment);
        setTransactionType("spending");
        setIsTransactionModalOpen(true);
    };

    // =====================================
    // 19. SAVE PAYMENT OR SPENDING
    // =====================================

    const handleSaveTransaction = async (transaction) => {
        try {
            if (transactionType === "payment") {
                const data = await createPayment({
                    apartmentId: transaction.apartmentId,
                    amount: transaction.amount,
                    date: transaction.date,
                    method: transaction.method,
                    description: transaction.description,
                });

                const savedPayment = data.payment;

                const formattedPayment = {
                    id: savedPayment._id,
                    apartmentId:
                        savedPayment.apartment?._id ||
                        transaction.apartmentId,
                    apartmentName:
                        savedPayment.apartment?.name ||
                        transaction.apartmentName,
                    amount: Number(savedPayment.amount),
                    date: savedPayment.date?.slice(0, 10),
                    description: savedPayment.description || "",
                    method: savedPayment.method,
                };

                setPayments((previousPayments) => [
                    ...previousPayments,
                    formattedPayment,
                ]);
            } else {
                const data = await createSpending({
                    apartmentId: transaction.apartmentId,
                    amount: transaction.amount,
                    date: transaction.date,
                    category: transaction.category,
                    description: transaction.description,
                });

                const savedSpending = data.spending;

                const formattedSpending = {
                    id: savedSpending._id,
                    apartmentId:
                        savedSpending.apartment?._id ||
                        transaction.apartmentId,
                    apartmentName:
                        savedSpending.apartment?.name ||
                        transaction.apartmentName,
                    amount: Number(savedSpending.amount),
                    date: savedSpending.date?.slice(0, 10),
                    description: savedSpending.description || "",
                    category: savedSpending.category,
                };

                setSpendings((previousSpendings) => [
                    ...previousSpendings,
                    formattedSpending,
                ]);
            }

            setIsTransactionModalOpen(false);
            setSelectedApartment(null);

            await showSuccess(
                transactionType === "payment"
                    ? "Payment added successfully!"
                    : "Spending added successfully!"
            );

        } catch (error) {
            console.error("Save transaction error:", error);

            showError(
                error.response?.data?.message ||
                "Failed to save transaction. Please try again."
            );
        }
    };

    // =====================================
    // 20. SHOW PAYMENT HISTORY
    // =====================================

    const handleShowPayments = (apartment) => {
        setSelectedApartment(apartment);
        setHistoryType("payment");
        setIsHistoryModalOpen(true);
    };

    // =====================================
    // 21. SHOW SPENDING HISTORY
    // =====================================

    const handleShowSpendings = (apartment) => {
        setSelectedApartment(apartment);
        setHistoryType("spending");
        setIsHistoryModalOpen(true);
    };

    // =====================================
    // 22. SELECTED APARTMENT HISTORY
    // =====================================

    const historyTransactions =
        historyType === "payment"
            ? payments.filter(
                (payment) =>
                    payment.apartmentId === selectedApartment?.id
            )
            : spendings.filter(
                (spending) =>
                    spending.apartmentId === selectedApartment?.id
            );

    // =====================================
    // 23. DASHBOARD UI
    // =====================================

    return (
        <div className="min-h-screen bg-base-200">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Dashboard Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">
                            Dashboard
                        </h1>

                        <p className="text-base-content/60 mt-1">
                            Manage your apartments, payments and spendings.
                        </p>
                    </div>

                    <button
                        onClick={handleAddApartment}
                        className="btn btn-primary"
                    >
                        <span className="text-xl">+</span>
                        Add Apartment
                    </button>
                </div>

                {/* Month Selector */}
                <div className="mb-6">
                    <MonthSelector
                        month={month}
                        year={year}
                        setMonth={setMonth}
                        setYear={setYear}
                    />
                </div>

                {/* Summary */}
                <div className="mb-8">
                    <Summary
                        payments={totalPayments}
                        spendings={totalSpendings}
                        due={totalDue}
                    />
                </div>

                {/* Apartment Heading */}
                <div className="mb-5">
                    <h2 className="text-xl font-bold">Apartments</h2>

                    <p className="text-sm text-base-content/60 mt-1">
                        Total {apartments.length} apartments
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <span className="ml-3">Loading apartments...</span>
                    </div>
                ) : error ? (
                    <div className="bg-base-100 rounded-xl border border-error p-8 text-center">
                        <h3 className="text-lg font-semibold text-error">
                            Something went wrong
                        </h3>

                        <p className="text-base-content/60 mt-2">{error}</p>

                        <button
                            onClick={() => window.location.reload()}
                            className="btn btn-primary mt-4"
                        >
                            Try Again
                        </button>
                    </div>
                ) : apartments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {apartmentsWithFinancialData.map((apartment) => (
                            <div key={apartment.id}>
                                <ApartmentCard
                                    apartment={apartment}
                                    onShowPayments={handleShowPayments}
                                    onAddPayment={handleAddPayment}
                                    onShowSpendings={handleShowSpendings}
                                    onAddSpending={handleAddSpending}
                                    onEditCharges={handleEditCharges}
                                />

                                <div className="flex justify-end gap-2 mt-2">
                                    <button
                                        onClick={() =>
                                            handleEditApartment(apartment)
                                        }
                                        className="btn btn-sm btn-outline btn-info"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDeleteApartment(apartment)
                                        }
                                        className="btn btn-sm btn-outline btn-error"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-base-100 rounded-xl border border-base-300 p-10 text-center">
                        <h3 className="text-lg font-semibold">
                            No Apartments Found
                        </h3>

                        <p className="text-base-content/60 mt-2 mb-4">
                            Start by adding your first apartment.
                        </p>

                        <button
                            onClick={handleAddApartment}
                            className="btn btn-primary"
                        >
                            + Add Apartment
                        </button>
                    </div>
                )}

                {isChargeLoading && (
                    <p className="text-sm text-base-content/60 mt-4">
                        Updating monthly charges...
                    </p>
                )}
            </main>

            {/* ADD / EDIT APARTMENT MODAL */}
            {isApartmentModalOpen && (
                <ApartmentModal
                    key={selectedApartment?.id ?? "new"}
                    isOpen={isApartmentModalOpen}
                    onClose={() => {
                        setIsApartmentModalOpen(false);
                        setSelectedApartment(null);
                    }}
                    onSave={handleSaveApartment}
                    apartment={selectedApartment}
                />
            )}

            {/* MONTHLY CHARGE MODAL */}
            {isChargeModalOpen && selectedApartment && (
                <MonthlyChargeModal
                    key={`${selectedApartment.id}-${month}-${year}`}
                    isOpen={isChargeModalOpen}
                    apartment={selectedApartment}
                    month={month}
                    year={year}
                    monthlyCharge={selectedCharge}
                    onClose={() => {
                        setIsChargeModalOpen(false);
                        setSelectedApartment(null);
                        setSelectedCharge(null);
                    }}
                    onSave={handleSaveMonthlyCharge}
                />
            )}

            {/* ADD PAYMENT / SPENDING MODAL */}
            {isTransactionModalOpen && selectedApartment && (
                <TransactionModal
                    key={`${transactionType}-${selectedApartment.id}`}
                    type={transactionType}
                    apartment={selectedApartment}
                    onClose={() => {
                        setIsTransactionModalOpen(false);
                        setSelectedApartment(null);
                    }}
                    onSave={handleSaveTransaction}
                />
            )}

            {/* PAYMENT / SPENDING HISTORY MODAL */}
            {isHistoryModalOpen && selectedApartment && (
                <TransactionHistoryModal
                    type={historyType}
                    apartment={selectedApartment}
                    transactions={historyTransactions}
                    onClose={() => {
                        setIsHistoryModalOpen(false);
                        setSelectedApartment(null);
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;
