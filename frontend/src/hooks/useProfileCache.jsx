import { useContext } from "react";
import ProfileCacheContext from "../context/ProfileCacheProvider";

export const useProfileCache = () => {
  return useContext(ProfileCacheContext);
};
