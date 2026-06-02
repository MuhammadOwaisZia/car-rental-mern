import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY || "$";

  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [cars, setCars] = useState([]);

  // Fetch logged-in user data
  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        headers: { authorization: token },
      });
      if (data.success) {
        setUser(data.user);
      } else {
        setToken(null);
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Fetch all available cars
  const fetchCars = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/cars`);
      if (data.success) {
        setCars(data.cars);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const value = {
    backendUrl,
    currency,
    token,
    setToken,
    user,
    setUser,
    showLogin,
    setShowLogin,
    cars,
    fetchCars,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
