import { useContext } from "react";
import MyPublicationsContext from "../context/MyPublicationsProvider";

export const useMyPublications = () => {
  return useContext(MyPublicationsContext);
};
