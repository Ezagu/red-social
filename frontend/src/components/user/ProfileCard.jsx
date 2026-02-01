import { Link, useNavigate } from "react-router";
import { LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { Avatar } from "../../components/ui/Avatar.jsx";
import { Loading } from "../../components/ui/Loading.jsx";
import { useMyPublications } from "../../hooks/useMyPublications.jsx";
import { useProfileCache } from "../../hooks/useProfileCache.jsx";

export const ProfileCard = () => {
  const { user, setUser, loading } = useAuth();
  const { setMyPublications } = useMyPublications();
  const { setProfileCache } = useProfileCache();

  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
    setUser({});
    setMyPublications([]);
    setProfileCache({});
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="text-text-primary bg-surface rounded-2xl p-4">
      <div className="ml-4 flex min-w-0 items-center gap-4 overflow-hidden">
        <Link to={"/profile/" + user._id} className="shrink-0">
          <Avatar src={user.image} size="2xl" />
        </Link>
        <div className="min-w-0 grow">
          <div className="flex justify-between">
            <Link
              to={"/profile/" + user._id}
              className="truncate text-4xl font-semibold"
            >
              {user.nick}
            </Link>
            <button
              onClick={logout}
              className="hover:bg-danger hover:text-text-primary bg-surface cursor-pointer rounded-full p-2 text-gray-500 transition-all"
            >
              <LogOut />
            </button>
          </div>

          <h2 className="text-text-secondary truncate text-lg">
            {user.fullName}
          </h2>
          <div className="mt-2 grid grid-cols-3">
            <Link
              to={"/profile/" + user._id}
              className="border-border-input border-r"
            >
              <h3 className="text-text-secondary text-center text-sm">
                Publicaciones
              </h3>
              <p className="text-center text-xl font-bold">
                {user.publicationsCount}
              </p>
            </Link>
            <Link
              to={"/users?mode=followers&id=" + user._id}
              className="border-border-input border-r"
            >
              <h3 className="text-text-secondary text-center text-sm">
                Seguidores
              </h3>
              <p className="text-center text-xl font-bold">
                {user.followersCount}
              </p>
            </Link>
            <Link to={"/users?mode=following&id=" + user._id}>
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
