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

import Navbar from "../components/Navbar";
import ApartmentCard from "../components/Apartmentcard";
import ApartmentModal from "../components/ApartmentModal";
import Summary from "../components/Summary";
import MonthSelector from "../components/MonthSelector";
import TransactionModal from "../components/Transactionmodal";
import TransactionHistoryModal from "../components/TransactionHistoryModal";

const Dashboard = () => {
    // =====================================
    // 1. APARTMENT DATA
    // =====================================

    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Sort apartments naturally by their names
    const sortApartments = (apartments) => {
        return [...apartments].sort((a, b) =>
            a.name.localeCompare(b.name, undefined, {
                numeric: true,
                sensitivity: "base",
            })
        );
    };

    // Fetch apartments from MongoDB
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
                        paid: 0,
                        due: 0,
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


    // Fetch payments from MongoDB
    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const data = await getPayments();

                const formattedPayments = data.payments.map((payment) => ({
                    id: payment._id,
                    apartmentId: payment.apartment?._id,
                    apartmentName: payment.apartment?.name || "Unknown Apartment",
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

    // Fetch spendings from MongoDB
    useEffect(() => {
        const fetchSpendings = async () => {
            try {
                const data = await getSpendings();

                const formattedSpendings = data.spendings.map((spending) => ({
                    id: spending._id,
                    apartmentId: spending.apartment?._id,
                    apartmentName: spending.apartment?.name || "Unknown Apartment",
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
    // 4. APARTMENT MODAL STATES
    // =====================================

    const [isApartmentModalOpen, setIsApartmentModalOpen] =
        useState(false);

    const [selectedApartment, setSelectedApartment] =
        useState(null);

    // =====================================
    // 5. TRANSACTION MODAL STATES
    // =====================================

    const [isTransactionModalOpen, setIsTransactionModalOpen] =
        useState(false);

    const [transactionType, setTransactionType] =
        useState("payment");

    // =====================================
    // 6. HISTORY MODAL STATES
    // =====================================

    const [isHistoryModalOpen, setIsHistoryModalOpen] =
        useState(false);

    const [historyType, setHistoryType] =
        useState("payment");

    // =====================================
    // 7. CALCULATE APARTMENT TOTAL
    // =====================================

    const getApartmentTotal = (apartment) => {
        return (
            Number(apartment.rent || 0) +
            Number(apartment.water || 0) +
            Number(apartment.garbage || 0) +
            Number(apartment.service || 0) +
            Number(apartment.due || 0)
        );
    };

    // =====================================
    // 8. DASHBOARD SUMMARY
    // =====================================

    const totalPayments = payments.reduce(
        (sum, payment) =>
            sum + Number(payment.amount || 0),
        0
    );

    const totalSpendings = spendings.reduce(
        (sum, spending) =>
            sum + Number(spending.amount || 0),
        0
    );

    const getApartmentPaid = (apartmentId) => {
        return payments
            .filter((payment) => payment.apartmentId === apartmentId)
            .reduce(
                (sum, payment) => sum + Number(payment.amount || 0),
                0
            );
    };

    const totalDue = apartments.reduce(
        (sum, apartment) =>
            sum +
            Math.max(
                getApartmentTotal(apartment) -
                getApartmentPaid(apartment.id),
                0
            ),
        0
    );

    // =====================================
    // 9. ADD APARTMENT
    // =====================================

    const handleAddApartment = () => {
        setSelectedApartment(null);
        setIsApartmentModalOpen(true);
    };

    // =====================================
    // 10. EDIT APARTMENT
    // =====================================

    const handleEditApartment = (apartment) => {
        setSelectedApartment(apartment);
        setIsApartmentModalOpen(true);
    };

    // =====================================
    // 11. CREATE / UPDATE APARTMENT
    // =====================================

    const handleSaveApartment = async (apartmentData) => {
        try {
            if (selectedApartment) {
                // UPDATE EXISTING APARTMENT

                const data = await updateApartment(
                    selectedApartment.id,
                    apartmentData
                );

                const updatedApartment = {
                    ...data.apartment,
                    id: data.apartment._id,
                    paid: selectedApartment.paid || 0,
                    due: selectedApartment.due || 0,
                };

                setApartments((previousApartments) =>
                    sortApartments(
                        previousApartments.map((apartment) =>
                            apartment.id === selectedApartment.id
                                ? updatedApartment
                                : apartment
                        )
                    )
                );

            } else {
                // CREATE NEW APARTMENT

                const data = await createApartment(apartmentData);

                const newApartment = {
                    ...data.apartment,
                    id: data.apartment._id,
                    paid: 0,
                    due: 0,
                };

                setApartments((previousApartments) =>
                    sortApartments([...previousApartments, newApartment])
                );
            }

            setIsApartmentModalOpen(false);
            setSelectedApartment(null);

        } catch (error) {
            console.error("Save apartment error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to save apartment. Please try again."
            );
        }
    };

    // =====================================
    // 12. DELETE APARTMENT
    // =====================================

    const handleDeleteApartment = async (apartment) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${apartment.name}?Its payment history may also become disconnected.`
        );

        if (!confirmed) return;

        try {
            // Delete from MongoDB first
            await deleteApartment(apartment.id);

            // Update React state after successful deletion
            setApartments((previousApartments) =>
                previousApartments.filter(
                    (item) => item.id !== apartment.id
                )
            );

            // Remove related local payment records
            setPayments((previousPayments) =>
                previousPayments.filter(
                    (item) => item.apartmentId !== apartment.id
                )
            );

            // Remove related local spending records
            setSpendings((previousSpendings) =>
                previousSpendings.filter(
                    (item) => item.apartmentId !== apartment.id
                )
            );

        } catch (error) {
            console.error("Delete apartment error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to delete apartment."
            );
        }
    };

    // =====================================
    // 13. ADD PAYMENT
    // =====================================

    const handleAddPayment = (apartment) => {
        setSelectedApartment(apartment);
        setTransactionType("payment");
        setIsTransactionModalOpen(true);
    };

    // =====================================
    // 14. ADD SPENDING
    // =====================================

    const handleAddSpending = (apartment) => {
        setSelectedApartment(apartment);
        setTransactionType("spending");
        setIsTransactionModalOpen(true);
    };

    // =====================================
    // 15. SAVE PAYMENT OR SPENDING
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
                        savedPayment.apartment?._id || transaction.apartmentId,
                    apartmentName:
                        savedPayment.apartment?.name || transaction.apartmentName,
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
                // Save spending to MongoDB
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
                        savedSpending.apartment?._id || transaction.apartmentId,
                    apartmentName:
                        savedSpending.apartment?.name || transaction.apartmentName,
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

        } catch (error) {
            console.error("Save transaction error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to save transaction. Please try again."
            );
        }
    };


    // =====================================
    // 16. SHOW PAYMENT HISTORY
    // =====================================

    const handleShowPayments = (apartment) => {
        setSelectedApartment(apartment);
        setHistoryType("payment");
        setIsHistoryModalOpen(true);
    };

    // =====================================
    // 17. SHOW SPENDING HISTORY
    // =====================================

    const handleShowSpendings = (apartment) => {
        setSelectedApartment(apartment);
        setHistoryType("spending");
        setIsHistoryModalOpen(true);
    };

    // =====================================
    // 18. GET SELECTED APARTMENT HISTORY
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
    // 19. DASHBOARD UI
    // =====================================

    return (
        <div className="min-h-screen bg-base-200">

            {/* Navbar */}
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
                    <h2 className="text-xl font-bold">
                        Apartments
                    </h2>

                    <p className="text-sm text-base-content/60 mt-1">
                        Total {apartments.length} apartments
                    </p>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <span className="ml-3">Loading apartments...</span>
                    </div>

                ) : error ? (

                    /* Error State */
                    <div className="bg-base-100 rounded-xl border border-error p-8 text-center">
                        <h3 className="text-lg font-semibold text-error">
                            Something went wrong
                        </h3>

                        <p className="text-base-content/60 mt-2">
                            {error}
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            className="btn btn-primary mt-4"
                        >
                            Try Again
                        </button>
                    </div>

                ) : apartments.length > 0 ? (

                    /* Apartment Cards */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                        {apartments.map((apartment) => {
                            const apartmentWithPayment = {
                                ...apartment,
                                paid: getApartmentPaid(apartment.id),
                            };

                            return (
                                <div key={apartment.id}>

                                    <ApartmentCard
                                        apartment={apartmentWithPayment}
                                        onShowPayments={handleShowPayments}
                                        onAddPayment={handleAddPayment}
                                        onShowSpendings={handleShowSpendings}
                                        onAddSpending={handleAddSpending}
                                    />

                                    {/* Edit and Delete Buttons */}
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
                            );
                        })}

                    </div>

                ) : (

                    /* Empty State */
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

            </main>

            {/* =====================================
          ADD / EDIT APARTMENT MODAL
      ===================================== */}

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

            {/* =====================================
          ADD PAYMENT / SPENDING MODAL
      ===================================== */}

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

            {/* =====================================
          PAYMENT / SPENDING HISTORY MODAL
      ===================================== */}

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
