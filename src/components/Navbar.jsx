
import { useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import {
  FiHome,
  FiGrid,
  FiUser,
  FiLogOut,
  FiMoreVertical,
  FiX,
} from "react-icons/fi";

const navItems = [
  { label: "Dashboard", icon: <FiGrid /> },
  { label: "Apartments", icon: <FiHome /> },
  { label: "Profile", icon: <FiUser /> },
];

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsMenuOpen(false);

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
    <header className="sticky top-0 z-40 bg-base-100/85 backdrop-blur-lg border-b border-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center shadow-md shrink-0">
              <FiHome className="text-lg" />
            </div>

            <h1 className="text-base sm:text-lg font-bold truncate">
              Rent <span className="text-primary">Management</span>
            </h1>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                className="btn btn-ghost btn-sm gap-2 font-medium"
              >
                {item.icon}
                {item.label}
              </button>
            ))}

            <div className="divider divider-horizontal mx-1"></div>

            <button
              onClick={handleLogout}
              className="btn btn-error btn-sm text-white gap-2"
            >
              <FiLogOut />
              Logout
            </button>
          </nav>

          {/* Mobile three-dot menu button */}
          <button
            onClick={() => setIsMenuOpen((previous) => !previous)}
            className="md:hidden btn btn-square btn-ghost"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <FiX className="text-xl" />
            ) : (
              <FiMoreVertical className="text-xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-base-200 bg-base-100 px-4 py-3 space-y-1 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setIsMenuOpen(false)}
              className="btn btn-ghost w-full justify-start gap-3 font-medium"
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="btn btn-error w-full justify-start gap-3 text-white"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default Navbar;
