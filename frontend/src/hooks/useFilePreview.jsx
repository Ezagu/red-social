import { useState } from "react";

export const useFilePreview = (inputRef) => {
  const [preview, setPreview] = useState(null);

  const handlePreview = (e) => {
    const inputFile = e.target.files[0];
    setPreview(inputFile ? URL.createObjectURL(inputFile) : null);
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
