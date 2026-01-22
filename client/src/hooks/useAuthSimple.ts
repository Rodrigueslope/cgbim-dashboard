import { useState, useEffect } from "react";

export function useAuthSimple() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const auth = localStorage.getItem("cgbim_auth");
    const authTime = localStorage.getItem("cgbim_auth_time");

    if (auth === "authenticated" && authTime) {
      // Verificar se a sessão expirou (24 horas)
      const timeElapsed = Date.now() - parseInt(authTime);
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (timeElapsed < twentyFourHours) {
        setIsAuthenticated(true);
      } else {
        // Sessão expirada
        logout();
      }
    }

    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("cgbim_auth");
    localStorage.removeItem("cgbim_auth_time");
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return { isAuthenticated, loading, logout };
}
