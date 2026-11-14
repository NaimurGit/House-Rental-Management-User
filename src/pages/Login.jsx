
import { useState } from "react";
import { useNavigate } from "react-router";
import { FiEye, FiEyeOff, FiLock, FiUser, FiHome } from "react-icons/fi";
import Swal from "sweetalert2";
import api from "../api/axios";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please enter your username and password.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        username: username.trim(),
        password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);

        await Swal.fire({
          icon: "success",
          title: "Welcome Back!",
          text: "Login successful.",
          timer: 1200,
          showConfirmButton: false,
        });

        navigate("/", { replace: true });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080f20] flex items-center justify-center p-4">

      <div className="w-full max-w-6xl min-h-[650px] bg-[#101a30] rounded-3xl overflow-hidden shadow-2xl border border-white/10 grid grid-cols-1 lg:grid-cols-2">

        {/* Left Side - Property Design */}
        <div className="hidden lg:flex relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-[#132b4c] via-[#10213c] to-[#080f20]">

          <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <FiHome className="text-white text-2xl" />
            </div>

            <div>
              <h2 className="text-white text-xl font-bold tracking-wide">
                Rent<span className="text-blue-400">Manager</span>
              </h2>
              <p className="text-blue-200/60 text-xs tracking-widest uppercase">
                Property Management
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="mb-8">
              <div className="text-7xl mb-5">🏢</div>

              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-5">
                Manage Your
                <span className="block text-blue-400">
                  Properties
                </span>
                With Confidence.
              </h1>

              <p className="text-blue-100/60 text-base leading-7 max-w-md">
                A smarter way to manage apartments, monthly rent,
                payments and expenses — all in one place.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md">

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                <p className="text-blue-300 text-2xl font-bold">01</p>
                <p className="text-white/70 text-sm mt-1">
                  Easy Management
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                <p className="text-cyan-300 text-2xl font-bold">24/7</p>
                <p className="text-white/70 text-sm mt-1">
                  Access Your Records
                </p>
              </div>

            </div>
          </div>

          <div className="relative z-10 text-blue-200/40 text-xs">
            © 2026 RentManager. All rights reserved.
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center p-7 sm:p-12 lg:p-14">

          <div className="w-full max-w-md">

            <div className="lg:hidden flex items-center gap-3 mb-12">
              <div className="w-11 h-11 rounded-xl bg-blue-500 flex items-center justify-center">
                <FiHome className="text-white text-2xl" />
              </div>

              <h2 className="text-white text-xl font-bold">
                Rent<span className="text-blue-400">Manager</span>
              </h2>
            </div>

            <div className="mb-10">
              <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-3">
                Welcome Back
              </p>

              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Sign In
              </h1>

              <p className="text-slate-400 text-sm leading-6">
                Enter your administrator credentials to access
                your dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">

              {/* Username */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Username
                </label>

                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />

                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    className="w-full h-14 pl-12 pr-4 rounded-xl bg-[#17243d] border border-white/10 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Password
                </label>

                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="w-full h-14 pl-12 pr-12 rounded-xl bg-[#17243d] border border-white/10 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <FiEyeOff size={19} />
                    ) : (
                      <FiEye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base shadow-lg shadow-blue-600/20 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Signing In..." : "Login to Dashboard"}
              </button>

            </form>

            <div className="mt-10 pt-6 border-t border-white/10 text-center">
              <p className="text-slate-500 text-xs">
                Secure Administrator Access
              </p>
              <p className="text-slate-600 text-xs mt-2">
                Your property data is protected.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
