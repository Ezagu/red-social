import { Outlet } from "react-router";
import { Header } from "./Header.jsx";
import { SocialAside } from "./SocialAside.jsx";
import { ProfileAside } from "./ProfileAside.jsx";
import React from "react";
import { Footer } from "./Footer.jsx";

export const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="m-4 grid flex-1 grid-cols-3 items-start gap-4">
        <ProfileAside />
        <Outlet />
        <SocialAside />
      </main>
      <Footer />
    </div>
  );
};
