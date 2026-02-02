import { Link } from "react-router";
import { Avatar } from "../components/ui/Avatar";
import { useAuth } from "../hooks/useAuth";
import { Bell, LogOut as LogoutIcon, Search } from "lucide-react";
import { useLogout } from "../hooks/useLogout";

export const Header = () => {
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-10 h-20 border-b border-gray-800 bg-gray-950 px-4 text-slate-50">
      <div className="grid h-full grid-cols-3 items-center xl:justify-center">
        <Link to={`/profile/${user._id}`} className="xl:hidden">
          <Avatar size="md" src={user.image} />
        </Link>

        <h1 className="group justify-self-center text-4xl font-light">
          <Link to="/">
            <span className="group-hover:text-primary font-bold transition-all">
              REACT
            </span>
            social
          </Link>
        </h1>

        <div className="flex gap-1 justify-self-end-safe sm:gap-2 xl:hidden">
          <Link
            to="/notifications"
            className="text-text-secondary hover:text-primary p-2"
          >
            <Bell className="size-7 sm:size-8" />
          </Link>
          <Link
            to="/search"
            className="text-text-secondary hover:text-primary p-2"
          >
            <Search className="size-7 sm:size-8" />
          </Link>
          <button
            to="/search"
            className="text-text-secondary hover:text-primary cursor-pointer p-2"
            onClick={logout}
          >
            <LogoutIcon className="size-7 sm:size-8" />
          </button>
        </div>
      </div>
    </header>
  );
};
