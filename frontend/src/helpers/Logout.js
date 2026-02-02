import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useMyPublications } from "../hooks/useMyPublications";
import { useProfileCache } from "../hooks/useProfileCache";

export const Logout = () => {
  const { setUser } = useAuth();
  const { setMyPublications } = useMyPublications();
  const { setProfileCache } = useProfileCache();

  const navigate = useNavigate();

  localStorage.clear();
  navigate("/login");
  setUser({});
  setMyPublications([]);
  setProfileCache({});
};
