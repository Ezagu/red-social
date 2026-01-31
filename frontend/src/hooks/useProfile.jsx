import { useContext } from "react";
import ProfileContext from "../context/ProfileProvider";

export const useProfile = () => {
  return useContext(ProfileContext);
};
