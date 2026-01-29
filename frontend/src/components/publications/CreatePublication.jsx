import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth.jsx";
import Request from "../../helpers/Request.jsx";
import { ChevronUp } from "lucide-react";
import { Pen } from "lucide-react";
import { Alert } from "../ui/Alert.jsx";
import { ImagePlus } from "lucide-react";
import { X } from "lucide-react";
import { url } from "../../helpers/Global.jsx";

export const CreatePublication = () => {
  const [show, setShow] = useState(true);
  const [result, setResult] = useState(null);

  const [filePreview, setFilePreview] = useState(null);
  const [fileSelected, setFileSelected] = useState(null);

  const { setUser } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setFileSelected(file ? file : null);
    setFilePreview(file ? URL.createObjectURL(file) : null);
  };

  const uploadPublication = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("text", e.target.text.value);
    if (fileSelected) {
      formData.append("file0", fileSelected);
    }

    //Subir texto de publicación
    const req = await fetch(url + "publication", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    const { status, message } = await req.json();

    setResult({ status, message });

    if (status === "error") {
      return;
    }

    // Actualizar contador de publicaciones si todo salió bien
    setUser((prev) => ({
      ...prev,
      publicationsCount: prev.publicationsCount + 1,
    }));

    // Borrar inputs
    e.target.text.value = "";
    setFilePreview(null);
    setFileSelected(null);
  };

  return (
    <div className="text-text-primary bg-surface relative rounded-2xl">
      <button
        className="flex w-full cursor-pointer items-center gap-2 p-4 text-xl font-semibold"
        onClick={() => {
          setShow((prev) => !prev);
        }}
      >
        <Pen />
        <h1>Publicar</h1>
        <ChevronUp
          className={`absolute right-4 transition-transform duration-300 ${
            show ? "rotate-0" : "rotate-180"
          }`}
        />
      </button>
      {show && (
        <form
          className="flex flex-col gap-4 p-4 pt-0"
          onSubmit={(e) => uploadPublication(e)}
        >
          <textarea
            placeholder="¿Qué estás pensando?"
            className="border-border-input focus:border-primary field-sizing-content resize-none rounded-2xl border p-2 py-3 text-xl focus:outline-none"
            maxLength="255"
            required
            name="text"
          />
          {filePreview && (
            <div className="relative w-full">
              <button
                className="bg-surface absolute top-2 right-2 cursor-pointer rounded-full p-2"
                onClick={() => {
                  setFilePreview(null);
                  setFileSelected(null);
                }}
              >
                <X />
              </button>
              <img
                src={filePreview}
                className="border-border-input max-h-64 w-full rounded-2xl border object-contain"
              />
            </div>
          )}

          {result && <Alert status={result.status} message={result.message} />}
          <div className="flex w-full items-center justify-between">
            <label
              className="hover:bg-primary cursor-pointer rounded-full p-2"
              htmlFor="file0"
            >
              <ImagePlus />
            </label>
            <input
              name="files"
              type="file"
              className="hidden"
              id="file0"
              onChange={handleFileChange}
            />
            <input
              type="submit"
              value="Publicar"
              className="bg-primary hover:bg-primary-hover cursor-pointer rounded-2xl p-2 px-4 font-semibold"
            />
          </div>
        </form>
      )}
    </div>
  );
};
