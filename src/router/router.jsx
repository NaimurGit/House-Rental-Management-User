
import { createBrowserRouter, Navigate } from "react-router";

import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import PrivateRoute from "../components/PrivateRoute";

const router = createBrowserRouter(
  [
    {
      path: "/login",
      element: <Login />,
    },
    {
      element: <PrivateRoute />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/login" replace />,
    },
  ],
  {
    basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/",
  }
);

export default router;
