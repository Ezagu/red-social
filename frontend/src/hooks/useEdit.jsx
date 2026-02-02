import { useState } from "react";
import { useAuth } from "./useAuth";
import { editUser } from "../services/user.services";
import { useProfileCache } from "./useProfileCache";

export const useEdit = () => {
  const [result, setResult] = useState(null);
  const { setUser } = useAuth();
  const { setProfileCache } = useProfileCache();
  const [loading, setLoading] = useState(false);

  const editProfile = async (data) => {
    setLoading(true);

    const { file: fileInput, ...remainingData } = data;
    const file = fileInput && fileInput[0];

    const formData = new FormData();
    for (const key in remainingData) {
      formData.append(key, data[key]);
    }
    if (file) {
      formData.append("file0", file);
    }

    const { status, message, user: userUpdated } = await editUser(formData);

    setResult({ status, message });
    setLoading(false);

    if (status === "error") return;

    setProfileCache(userUpdated);
    setUser(userUpdated);

    setTimeout(clearResult, 3000);
  };

  const clearResult = () => {
    setResult(null);
  };

  return {
    result,
    editProfile,
    loading,
    clearResult,
  };
};
