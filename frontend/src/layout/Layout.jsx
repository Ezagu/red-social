import { Outlet, useNavigate } from "react-router";
import { Header } from "./Header.jsx";
import { SocialAside } from "./SocialAside.jsx";
import { ProfileAside } from "./ProfileAside.jsx";
import React from "react";
import { Footer } from "./Footer.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { Loading } from "../components/ui/Loading.jsx";

export const Layout = () => {
  const { user, loading } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="m-4 grid flex-1 grid-cols-3 items-start gap-4">
        {loading ? (
          <Loading className="col-span-3 self-center" />
        ) : user._id ? (
          <>
            <ProfileAside />
            <Outlet />
            <SocialAside />
          </>
        ) : (
          navigate("/login")
        )}
      </main>
      <Footer />
    </div>
  );
};
