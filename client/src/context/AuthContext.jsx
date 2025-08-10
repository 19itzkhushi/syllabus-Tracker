import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // for initial check
 


  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }))
  }

  const login = (userData) => setUser(userData);
  const logout = () => {
    setUser(null);
    API.post("/users/logout", {}, { withCredentials: true });
  };


 const refreshUser = async () => {
    try {
      const res = await API.get("/users/current-user", { withCredentials: true });
      setUser(res.data.data);
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  // On app load — auto fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/users/current-user", { withCredentials: true });
        console.log("All data :",res.data.data);
        setUser(res.data.data); // assuming apiResponse returns user in data
       
      } catch (err) {
        setUser(null); // Not logged in
      } finally {
        setLoading(false);
      }
    };
 
    fetchUser();
    
  }, []);

    

  return (
    <AuthContext.Provider value={{ user, login, updateUser ,refreshUser,logout, loading,}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

