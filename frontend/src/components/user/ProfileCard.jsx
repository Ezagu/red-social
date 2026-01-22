import React from "react";
import { Avatar } from "../../components/ui/Avatar.jsx";
import { Link, useNavigate } from "react-router";
import { LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { url } from "../../helpers/Global.jsx";
import { Loading } from "../../components/ui/Loading.jsx";

export const ProfileCard = () => {
  const { user, setUser, loading } = useAuth();

  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
    setUser({});
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="text-text-primary bg-surface relative rounded-2xl p-4">
      <button
        onClick={logout}
        className="hover:bg-danger hover:text-text-primary absolute top-5 right-10 cursor-pointer rounded-full p-2 text-gray-500 transition-all"
      >
        <LogOut />
      </button>
      <div className="ml-4 flex items-center gap-4">
        <Link to="/profile">
          <Avatar
            src={url + "user/avatar/" + user.image}
            size="2xl"
            className="border-primary border"
          />
        </Link>
        <div className="grow">
          <Link to="/profile" className="text-4xl font-semibold">
            {user.nick}
          </Link>
          <h2 className="text-text-secondary text-lg">{user.fullName}</h2>
          <div className="mt-2 grid grid-cols-3">
            <Link to="/profile" className="border-border-input border-r">
              <h3 className="text-text-secondary text-center text-sm">
                Publicaciones
              </h3>
              <p className="text-center text-xl font-bold">
                {user.publicationsCount}
              </p>
            </Link>
            <Link to="/users" className="border-border-input border-r">
              <h3 className="text-text-secondary text-center text-sm">
                Seguidores
              </h3>
              <p className="text-center text-xl font-bold">
                {user.followersCount}
              </p>
            </Link>
            <Link to="/users">
              <h3 className="text-text-secondary text-center text-sm">
                Seguidos
              </h3>
              <p className="text-center text-xl font-bold">
                {user.followingCount}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
