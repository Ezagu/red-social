import { useId, useState } from "react";
import { X, ImagePlus } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useMyPublications } from "../../hooks/useMyPublications.jsx";
import { useProfile } from "../../hooks/useProfile.jsx";
import { url } from "../../helpers/Global.jsx";
import { Alert } from "../ui/Alert.jsx";
import { Button } from "../ui/Button.jsx";

export const CreatePublication = () => {
  const [result, setResult] = useState(null);

  const [filePreview, setFilePreview] = useState(null);
  const [fileSelected, setFileSelected] = useState(null);

  const { setMyPublications } = useMyPublications();
  const { profile: profileCache, setProfile: setProfileCache } = useProfile();

  const fileInput = useId();

  const { user, setUser } = useAuth();

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

    const { status, message, publication } = await req.json();

    setResult({ status, message });

    if (status === "error") {
      return;
    }

    // Actualizar contador de publicaciones si todo salió bien
    setUser((prev) => ({
      ...prev,
      publicationsCount: prev.publicationsCount + 1,
    }));
    setMyPublications((prev) => [publication, ...prev]);
    if (profileCache._id === user._id)
      setProfileCache((prev) => ({
        ...prev,
        publicationsCount: prev.publicationsCount + 1,
      }));

    // Borrar inputs
    e.target.text.value = "";
    setFilePreview(null);
    setFileSelected(null);

    setTimeout(() => {
      setResult(null);
    }, 3000);
  };

  return (
    <form
      className="flex flex-col gap-4 p-4"
      onSubmit={(e) => uploadPublication(e)}
      onChange={() => {
        if (result) setResult(null);
      }}
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
          htmlFor={fileInput}
        >
          <ImagePlus />
        </label>
        <input
          name="files"
          type="file"
          className="hidden"
          id={fileInput}
          onChange={handleFileChange}
        />
        <Button type="submit">Publicar</Button>
      </div>
    </form>
  );
};
