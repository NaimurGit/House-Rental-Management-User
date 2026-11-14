
import Swal from "sweetalert2";

export const showSuccess = (message) => {
  return Swal.fire({
    icon: "success",
    title: "Success!",
    text: message,
    confirmButtonColor: "#16a34a",
  });
};

export const showError = (message) => {
  return Swal.fire({
    icon: "error",
    title: "Oops!",
    text: message,
    confirmButtonColor: "#dc2626",
  });
};

export const showWarning = (message) => {
  return Swal.fire({
    icon: "warning",
    title: "Warning!",
    text: message,
    confirmButtonColor: "#d97706",
  });
};

export const showConfirm = (message) => {
  return Swal.fire({
    icon: "question",
    title: "Are you sure?",
    text: message,
    showCancelButton: true,
    confirmButtonText: "Yes, continue",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#6b7280",
  });
};
