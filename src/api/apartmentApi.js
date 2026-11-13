
import api from "./axios";

// GET all apartments
export const getApartments = async () => {
  const response = await api.get("/apartments");
  return response.data;
};

// GET single apartment
export const getApartmentById = async (id) => {
  const response = await api.get(`/apartments/${id}`);
  return response.data;
};

// CREATE apartment
export const createApartment = async (apartmentData) => {
  const response = await api.post("/apartments", apartmentData);
  return response.data;
};

// UPDATE apartment
export const updateApartment = async (id, apartmentData) => {
  const response = await api.put(`/apartments/${id}`, apartmentData);
  return response.data;
};

// DELETE apartment
export const deleteApartment = async (id) => {
  const response = await api.delete(`/apartments/${id}`);
  return response.data;
};
