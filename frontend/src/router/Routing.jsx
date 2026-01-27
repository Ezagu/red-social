import React from "react";
import { Route, Routes, BrowserRouter } from "react-router";
import { Footer } from "../layout/Footer.jsx";
import { Home } from "../pages/Home.jsx";
import { Login } from "../pages/Login.jsx";
import { Register } from "../pages/Register.jsx";
import { Layout } from "../layout/Layout.jsx";
import { Profile } from "../pages/Profile.jsx";
import { Edit } from "../pages/edit.jsx";
import { PublicationPage } from "../pages/PublicationPage.jsx";
import { Users } from "../pages/Users.jsx";
import { Error } from "../pages/Error.jsx";
import { AuthProvider } from "../context/AuthProvider.jsx";

export const Routing = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/*Public Routes*/}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/*Private Routes*/}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/edit" element={<Edit />} />
            <Route path="/publication/:id" element={<PublicationPage />} />
            <Route path="/users" element={<Users />} />
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
