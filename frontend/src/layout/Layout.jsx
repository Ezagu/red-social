import { Outlet } from "react-router";
import { Header } from "./Header.jsx";
import { SocialAside } from "./SocialAside.jsx";
import { ProfileAside } from "./ProfileAside.jsx";
import React from "react";

export const Layout = () => {
  return (
    <>
      <Header />
      <main className="grid grid-cols-3 gap-4 p-4">
        <ProfileAside />
        <Outlet />
        <SocialAside />
      </main>
    </>
  );
};
