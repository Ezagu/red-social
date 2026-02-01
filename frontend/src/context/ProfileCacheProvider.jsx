import { createContext, useState } from "react";

const ProfileCacheContext = createContext();

export const ProfileCacheProvider = ({ children }) => {
  const [profileCache, setProfileCache] = useState({});

  return (
    <ProfileCacheContext.Provider value={{ profileCache, setProfileCache }}>
      {children}
    </ProfileCacheContext.Provider>
  );
};

export default ProfileCacheContext;
