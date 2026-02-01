import React from "react";
import { Link } from "react-router";
import { Avatar } from "../components/ui/Avatar";
import { useAuth } from "../hooks/useAuth";
import { Menu } from "lucide-react";

export const Header = () => {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-10 h-20 items-center border-b border-gray-800 bg-gray-950 px-4 text-slate-50">
      <div className="m-auto flex h-full max-w-2xl items-center justify-between xl:justify-center">
        <Link to={`/profile/${user._id}`} className="xl:hidden">
          <Avatar size="md" src={user.image} />
        </Link>
        <h1 className="group text-4xl font-light">
          <Link to="/">
            <span className="group-hover:text-primary font-bold transition-all">
              REACT
            </span>
            social
          </Link>
        </h1>
        <div className="xl:hidden">
          <Menu />
        </div>
      </div>
    </header>
  );
};
