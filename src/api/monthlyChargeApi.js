
import api from "./axios";

// Get charges for a selected month and year
export const getMonthlyCharges = async (month, year) => {
  const response = await api.get(
    `/monthly-charges?month=${month}&year=${year}`
  );

  return response.data;
};

// Add or update monthly charges
export const saveMonthlyCharge = async (chargeData) => {
  const response = await api.post("/monthly-charges", chargeData);

  return response.data;
};
