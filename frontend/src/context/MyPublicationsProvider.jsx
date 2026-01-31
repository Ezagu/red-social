import { createContext, useState } from "react";

const MyPublicationsContext = createContext();

export const MyPublicationsProvider = ({ children }) => {
  const [myPublications, setMyPublications] = useState([]);

  return (
    <MyPublicationsContext.Provider
      value={{ myPublications, setMyPublications }}
    >
      {children}
    </MyPublicationsContext.Provider>
  );
};

export default MyPublicationsContext;
