
import api from "./axios";

// GET all payments
export const getPayments = async () => {
  const response = await api.get("/payments");
  return response.data;
};

// CREATE payment
export const createPayment = async (paymentData) => {
  const response = await api.post("/payments", paymentData);
  return response.data;
};

// GET payments by apartment
export const getPaymentsByApartment = async (apartmentId) => {
  const response = await api.get(
    `/payments/apartment/${apartmentId}`
  );
  return response.data;
};

// DELETE payment
export const deletePayment = async (id) => {
  const response = await api.delete(`/payments/${id}`);
  return response.data;
};
