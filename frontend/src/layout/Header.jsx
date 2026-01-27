import React from "react";
import { Link } from "react-router";

export const Header = () => {
  return (
    <header className="sticky top-0 z-10 flex h-20 w-full items-center justify-center border-b border-gray-800 bg-gray-950 pr-4 pl-12 text-slate-50">
      <h1 className="group text-4xl font-light">
        <Link to="/">
          <span className="group-hover:text-primary font-bold transition-all">
            REACT
          </span>
          social
        </Link>
      </h1>
    </header>
  );
};
