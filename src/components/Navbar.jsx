
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");

      await Swal.fire({
        title: "Logged Out!",
        text: "You have successfully logged out.",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });

      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="navbar bg-base-100 px-6 border-b border-base-200">
      <div className="flex-1">
        <h1 className="text-xl font-bold">
          Rent Management
        </h1>
      </div>

      <div className="flex gap-3">
        <button className="btn btn-ghost btn-sm">
          Dashboard
        </button>

        <button className="btn btn-ghost btn-sm">
          Apartments
        </button>

        <button className="btn btn-ghost btn-sm">
          Profile
        </button>

        <button
          onClick={handleLogout}
          className="btn btn-error btn-sm text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
