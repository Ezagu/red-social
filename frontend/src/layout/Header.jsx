import React from "react";
import { Link } from "react-router";

export const Header = () => {
  return (
    <header className="sticky top-0 flex h-16 w-full items-center justify-center border-b border-gray-800 bg-gray-950 pr-4 pl-12 text-slate-50">
      <h1 className="text-3xl font-light">
        <Link to="/social">
          <span className="font-bold">REACT</span>social
        </Link>
      </h1>
    </header>
  );
};
