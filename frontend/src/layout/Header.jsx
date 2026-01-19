import React from "react";
import { Avatar } from "../components/ui/Avatar";
import { Link } from "react-router";
import { LogOut } from "lucide-react";

export const Header = () => {
  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-gray-800 bg-gray-950 pr-4 pl-12 text-slate-50">
      <h1 className="text-3xl font-light">
        <Link to="/social">
          <span className="font-bold">REACT</span>social
        </Link>
      </h1>
      <div className="flex items-center gap-1">
        <Link className="flex items-center gap-2 rounded-2xl px-2 py-1 transition-all hover:bg-gray-800">
          <span className="text-lg text-slate-50/90">Ezagu</span>
          <Avatar src="src/assets/kiara.jpg" size="10" />
        </Link>
        <button className="cursor-pointer rounded-full p-2 text-gray-500 transition-all hover:bg-red-400/50 hover:text-amber-50">
          <LogOut />
        </button>
      </div>
    </header>
  );
};
