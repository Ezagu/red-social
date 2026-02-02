import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useMyPublications } from "../hooks/useMyPublications";
import { useProfileCache } from "../hooks/useProfileCache";

export const useLogout = () => {
  const { setUser } = useAuth();
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

  return logout;
};
