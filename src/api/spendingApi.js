import api from "./axios";

// GET ALL SPENDINGS
export const getSpendings = async () => {
  const response = await api.get("/spendings");
  return response.data;
};

// CREATE SPENDING
export const createSpending = async (spendingData) => {
  const response = await api.post("/spendings", spendingData);
  return response.data;
};

// GET SPENDINGS BY APARTMENT
export const getSpendingsByApartment = async (apartmentId) => {
  const response = await api.get(
    `/spendings/apartment/${apartmentId}`
  );
  return response.data;
};

// DELETE SPENDING
export const deleteSpending = async (id) => {
  const response = await api.delete(`/spendings/${id}`);
  return response.data;
};