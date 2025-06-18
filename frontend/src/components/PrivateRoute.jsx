import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
  const token = localStorage.getItem("token");
  const PORT = import.meta.env.VITE_NGINX_PORT || 8080;

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch(
          `http://localhost:${PORT}/api/auth/verify-token`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Unauthorized");

        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setIsAuthenticated(false);
    }
  }, [PORT, token]);

  if (isAuthenticated === null) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Verifying...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
