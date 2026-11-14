
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

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

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
                    apartmentId: spending.apartment?._id || null,
                    apartmentName: spending.apartment?.name || "General",
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
    // 5. MENU STATE
    // =====================================

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // =====================================
    // 6. APARTMENT MODAL STATES
    // =====================================

    const [isApartmentModalOpen, setIsApartmentModalOpen] = useState(false);
    const [selectedApartment, setSelectedApartment] = useState(null);

    // =====================================
    // 7. MONTHLY CHARGE MODAL STATES
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
    // 8. TRANSACTION MODAL STATES
    // =====================================

    const [isTransactionModalOpen, setIsTransactionModalOpen] =
        useState(false);

    const [transactionType, setTransactionType] = useState("payment");

    // =====================================
    // 9. HISTORY MODAL STATES
    // =====================================

    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [historyType, setHistoryType] = useState("payment");

    // =====================================
    // 10. DATE HELPERS
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
    // 11. SELECTED MONTH TRANSACTIONS
    // =====================================

    const selectedMonthPayments = payments.filter((payment) =>
        isSelectedMonth(payment.date)
    );

    const selectedMonthSpendings = spendings.filter((spending) =>
        isSelectedMonth(spending.date)
    );

    const selectedMonthGeneralSpendings = selectedMonthSpendings.filter(
        (spending) => !spending.apartmentId
    );

    // =====================================
    // 12. CALCULATE APARTMENT FINANCIAL DATA
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

        const previousCharges = Number(
            monthlyCharge?.previousCharges || 0
        );

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

        const previousDue = Math.max(
            previousCharges - previousPayments,
            0
        );

        const paid = selectedMonthPayments
            .filter((payment) => payment.apartmentId === apartment.id)
            .reduce(
                (sum, payment) => sum + Number(payment.amount || 0),
                0
            );

        const total = currentMonthTotal + previousDue;

        const remaining = Math.max(total - paid, 0);

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
    // 13. DASHBOARD SUMMARY
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
    // 14. ADD APARTMENT
    // =====================================

    const handleAddApartment = () => {
        setSelectedApartment(null);
        setIsApartmentModalOpen(true);
    };

    // =====================================
    // 15. EDIT APARTMENT
    // =====================================

    const handleEditApartment = (apartment) => {
        setSelectedApartment(apartment);
        setIsApartmentModalOpen(true);
    };

    // =====================================
    // 16. CREATE / UPDATE APARTMENT
    // =====================================

    const handleSaveApartment = async (apartmentData) => {
        let apartmentId;

        try {
            if (selectedApartment) {
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

            await saveMonthlyCharge({
                apartmentId,
                month,
                year,
                rent: Number(apartmentData.rent || 0),
                water: Number(apartmentData.water || 0),
                garbage: Number(apartmentData.garbage || 0),
                service: Number(apartmentData.service || 0),
            });

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
    // 17. DELETE APARTMENT
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
    // 18. ADD PAYMENT
    // =====================================

    const handleAddPayment = (apartment) => {
        setSelectedApartment(apartment);
        setTransactionType("payment");
        setIsTransactionModalOpen(true);
    };

    // =====================================
    // 19. ADD APARTMENT SPENDING
    // =====================================

    const handleAddSpending = (apartment) => {
        setSelectedApartment(apartment);
        setTransactionType("spending");
        setIsTransactionModalOpen(true);
    };

    // =====================================
    // 20. ADD GENERAL SPENDING
    // =====================================

    const handleAddGeneralSpending = () => {
        setSelectedApartment(null);
        setTransactionType("spending");
        setIsTransactionModalOpen(true);
        setIsMenuOpen(false);
    };

    // =====================================
    // 21. SAVE PAYMENT OR SPENDING
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
                    apartmentId: transaction.apartmentId || undefined,
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
                        transaction.apartmentId ||
                        null,
                    apartmentName:
                        savedSpending.apartment?.name ||
                        transaction.apartmentName ||
                        "General",
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
    // 22. SHOW PAYMENT HISTORY
    // =====================================

    const handleShowPayments = (apartment) => {
        setSelectedApartment(apartment);
        setHistoryType("payment");
        setIsHistoryModalOpen(true);
    };

    // =====================================
    // 23. SHOW APARTMENT SPENDING HISTORY
    // =====================================

    const handleShowSpendings = (apartment) => {
        setSelectedApartment(apartment);
        setHistoryType("spending");
        setIsHistoryModalOpen(true);
    };

    // =====================================
    // 24. SHOW GENERAL SPENDING
    // =====================================

    const handleShowGeneralSpendings = () => {
        setSelectedApartment(null);
        setHistoryType("general");
        setIsHistoryModalOpen(true);
        setIsMenuOpen(false);
    };

    // =====================================
    // 25. SELECTED HISTORY TRANSACTIONS
    // =====================================

    const historyTransactions =
        historyType === "payment"
            ? payments.filter(
                (payment) =>
                    payment.apartmentId === selectedApartment?.id
            )
            : historyType === "general"
                ? selectedMonthGeneralSpendings
                : spendings.filter(
                    (spending) =>
                        spending.apartmentId === selectedApartment?.id
                );

    // =====================================
    // 26. MONTHLY BILL EXPORT HELPERS
    // =====================================

    const getMonthName = () => {
        return new Date(year, month).toLocaleString("en-US", {
            month: "long",
        });
    };

    const formatExportCurrency = (amount) => {
        return Number(amount || 0).toLocaleString("en-BD");
    };

    // =====================================
    // 27. EXPORT MONTHLY BILL AS PDF
    // =====================================

    const handleExportPDF = () => {
        try {
            const doc = new jsPDF({
                orientation: "landscape",
            });

            const monthName = getMonthName();

            doc.setFontSize(18);
            doc.text("House Rent Management", 14, 18);

            doc.setFontSize(12);
            doc.text(
                `Monthly Bill - ${monthName} ${year}`,
                14,
                27
            );

            const tableData = apartmentsWithFinancialData.map(
                (apartment) => [
                    apartment.name,
                    formatExportCurrency(apartment.rent),
                    formatExportCurrency(apartment.water),
                    formatExportCurrency(apartment.garbage),
                    formatExportCurrency(apartment.service),
                    formatExportCurrency(apartment.due),
                    formatExportCurrency(apartment.total),
                    formatExportCurrency(apartment.paid),
                    formatExportCurrency(apartment.remaining),
                ]
            );

            autoTable(doc, {
                startY: 35,
                head: [[
                    "Apartment",
                    "Rent",
                    "Water",
                    "Garbage",
                    "Service",
                    "Previous Due",
                    "Total Bill",
                    "Paid",
                    "Remaining",
                ]],
                body: tableData,
                styles: {
                    fontSize: 8,
                    cellPadding: 3,
                },
                headStyles: {
                    fillColor: [41, 128, 185],
                },
            });

            let finalY = doc.lastAutoTable?.finalY || 35;

            finalY += 12;

            doc.setFontSize(11);

            doc.text(
                `Total Payments: BDT ${formatExportCurrency(totalPayments)}`,
                14,
                finalY
            );

            doc.text(
                `Total Remaining Due: BDT ${formatExportCurrency(totalDue)}`,
                14,
                finalY + 8
            );

            doc.text(
                `Total Monthly Spendings: BDT ${formatExportCurrency(totalSpendings)}`,
                14,
                finalY + 16
            );

            doc.save(`Monthly_Bill_${monthName}_${year}.pdf`);

            setIsMenuOpen(false);

        } catch (error) {
            console.error("PDF export error:", error);
            showError("Failed to generate PDF. Please try again.");
        }
    };

    // =====================================
    // 28. EXPORT MONTHLY BILL AS EXCEL
    // =====================================

    const handleExportExcel = () => {
        try {
            const monthName = getMonthName();

            const billData = apartmentsWithFinancialData.map(
                (apartment) => ({
                    Apartment: apartment.name,
                    "House Rent": apartment.rent,
                    "Water Bill": apartment.water,
                    "Garbage Bill": apartment.garbage,
                    "Service Charge": apartment.service,
                    "Previous Due": apartment.due,
                    "Total Bill": apartment.total,
                    "Paid This Month": apartment.paid,
                    "Remaining Due": apartment.remaining,
                })
            );

            const spendingData = selectedMonthSpendings.map(
                (spending) => ({
                    Date: spending.date,
                    Apartment: spending.apartmentName,
                    Category: spending.category,
                    Description: spending.description,
                    Amount: spending.amount,
                })
            );

            const workbook = XLSX.utils.book_new();

            const billWorksheet = XLSX.utils.json_to_sheet(
                billData.length > 0
                    ? billData
                    : [{ Message: "No apartments found" }]
            );

            XLSX.utils.book_append_sheet(
                workbook,
                billWorksheet,
                "Monthly Bills"
            );

            const spendingWorksheet = XLSX.utils.json_to_sheet(
                spendingData.length > 0
                    ? spendingData
                    : [{ Message: "No spending records for this month" }]
            );

            XLSX.utils.book_append_sheet(
                workbook,
                spendingWorksheet,
                "Monthly Spendings"
            );

            XLSX.writeFile(
                workbook,
                `Monthly_Bill_${monthName}_${year}.xlsx`
            );

            setIsMenuOpen(false);

        } catch (error) {
            console.error("Excel export error:", error);
            showError("Failed to generate Excel file. Please try again.");
        }
    };

    // =====================================
    // 29. DASHBOARD UI
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

                    {/* THREE DOT MENU */}
                    <div className="relative">

                        <button
                            onClick={() =>
                                setIsMenuOpen((previous) => !previous)
                            }
                            className="btn btn-square btn-outline"
                            aria-label="Dashboard options"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="text-2xl leading-none">
                                ⋮
                            </span>
                        </button>

                        {isMenuOpen && (
                            <>
                                <button
                                    type="button"
                                    className="fixed inset-0 z-40 cursor-default"
                                    onClick={() => setIsMenuOpen(false)}
                                    aria-label="Close menu"
                                />

                                <div className="absolute right-0 top-full mt-2 w-64 bg-base-100 rounded-xl shadow-xl border border-base-300 z-50 p-2">

                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            handleAddApartment();
                                        }}
                                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-base-200 flex items-center gap-3"
                                    >
                                        <span className="text-lg">＋</span>
                                        Add Apartment
                                    </button>

                                    <div className="divider my-1"></div>

                                    <button
                                        onClick={handleExportPDF}
                                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-base-200 flex items-center gap-3"
                                    >
                                        <span>📄</span>
                                        Print Monthly Bill (PDF)
                                    </button>

                                    <button
                                        onClick={handleExportExcel}
                                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-base-200 flex items-center gap-3"
                                    >
                                        <span>📊</span>
                                        Export Monthly Bill (Excel)
                                    </button>

                                    <div className="divider my-1"></div>

                                    <button
                                        onClick={handleShowGeneralSpendings}
                                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-base-200 flex items-center gap-3"
                                    >
                                        <span>📋</span>
                                        Show General Spending
                                    </button>

                                    <button
                                        onClick={handleAddGeneralSpending}
                                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-base-200 flex items-center gap-3"
                                    >
                                        <span>＋</span>
                                        Add General Spending
                                    </button>

                                </div>
                            </>
                        )}

                    </div>
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

                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <span className="ml-3">
                            Loading apartments...
                        </span>
                    </div>
                ) : error ? (
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
            {isTransactionModalOpen && (
                <TransactionModal
                    key={`${transactionType}-${selectedApartment?.id || "general"}`}
                    type={transactionType}
                    apartment={
                        selectedApartment || {
                            id: null,
                            name: "General Spending",
                        }
                    }
                    onClose={() => {
                        setIsTransactionModalOpen(false);
                        setSelectedApartment(null);
                    }}
                    onSave={handleSaveTransaction}
                />
            )}

            {/* PAYMENT / SPENDING HISTORY MODAL */}
            {isHistoryModalOpen && (
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
