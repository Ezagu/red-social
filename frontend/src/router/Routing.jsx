import React from "react";
import { Route, Routes, BrowserRouter } from "react-router";
import { Footer } from "../layout/Footer.jsx";
import { Home } from "../pages/Home.jsx";
import { Login } from "../pages/Login.jsx";
import { Register } from "../pages/Register.jsx";
import { Layout } from "../layout/Layout.jsx";

export const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/*Public Routes*/}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/*Private Routes*/}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};
