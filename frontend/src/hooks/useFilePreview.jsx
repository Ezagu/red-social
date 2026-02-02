import { useState } from "react";

export const useFilePreview = (inputRef) => {
  const [preview, setPreview] = useState(null);

  const handlePreview = (e) => {
    const inputFile = e.target.files[0];
    if (!inputFile) return;

    setPreview(URL.createObjectURL(inputFile));
  };

  const removePreview = () => {
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return {
    handlePreview,
    removePreview,
    preview,
  };
};
