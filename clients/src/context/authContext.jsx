import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContexProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post(
      "http://localhost:8800/api/auth/login", // Ensure this URL is correct
      inputs,
      { withCredentials: true }
    );
    setCurrentUser(res.data);
  };
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:8800/api/auth/logout", // Backend endpoint for logout
        {}, // Empty request body
        { withCredentials: true } // Include cookies
      );
      setCurrentUser(null); // Clear user state
      localStorage.removeItem("user"); // Remove user data from local storage
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
    }
  };
  
  
  

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
