import { useState } from "react";
import { useAuth } from "./useAuth";
import { savePublication } from "../services/publication.services";
import { useMyPublications } from "./useMyPublications";
import { useProfileCache } from "./useProfileCache";

export const usePublication = () => {
  const [result, setResult] = useState(null);
  const { user, setUser } = useAuth();
  const { setMyPublications } = useMyPublications();
  const { profileCache, setProfileCache } = useProfileCache();
  const [loading, setLoading] = useState(false);

  const uploadPublication = async (e) => {
    e.preventDefault();
    setLoading(true);

    const text = e.target.text.value;
    const file = e.target.files.files[0];

    const formData = new FormData();
    formData.append("text", text);
    if (file) {
      formData.append("file0", file);
    }

    const response = await savePublication(formData);

    setResult({ status: response.status, message: response.message });
    setLoading(false);

    if (response.status === "error") return;

    // Actualizar contador y lista de publicaciones
    setUser((prev) => ({
      ...prev,
      publicationsCount: prev.publicationsCount + 1,
    }));

    setMyPublications((prev) => [response.publication, ...prev]);

    if (profileCache._id === user._id) {
      setProfileCache((prev) => ({
        ...prev,
        publicationsCount: prev.publicationsCount + 1,
      }));
    }

    e.target.text.value = "";
    e.target.files.value = "";

    setTimeout(() => {
      setResult(null);
    }, 3000);
  };

  const clearResult = () => {
    setResult(null);
  };

  return {
    uploadPublication,
    result,
    clearResult,
    loading,
  };
};
