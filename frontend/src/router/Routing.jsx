import React from "react";
import { Route, Routes, BrowserRouter } from "react-router";
import { Footer } from "../layout/Footer.jsx";
import { Home } from "../pages/Home.jsx";
import { Login } from "../pages/Login.jsx";
import { Register } from "../pages/Register.jsx";
import { Layout } from "../layout/Layout.jsx";
import { Profile } from "../pages/Profile.jsx";
import { Edit } from "../pages/edit.jsx";

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
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/edit" element={<Edit />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};
