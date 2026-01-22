import React, { useContext, useEffect, useState } from "react";
import request from "../helpers/Request";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const AuthContext = useContext();

  useEffect(() => {});

  const getProfile = async () => {
    const profile = await request("user", "GET", {});
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
