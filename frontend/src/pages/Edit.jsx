import React, { useEffect, useState } from "react";
import { Avatar } from "../components/ui/Avatar";
import { CircleX } from "lucide-react";
import { CircleCheck } from "lucide-react";
import { ImagePlus } from "lucide-react";
import { PageHeader } from "../components/pages/PageHeader";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import { Alert } from "../components/ui/Alert";
import Request from "../helpers/Request";
import { useNavigate } from "react-router";
import { url } from "../helpers/Global";

export const Edit = () => {
  const [filePreview, setFilePreview] = useState(null);
  const [fileSelected, setFileSelected] = useState(null);
  const [result, setResult] = useState(null);

  const { user, setUser } = useAuth();
  const { register, handleSubmit, reset } = useForm();

  const navigate = useNavigate();

  useEffect(() => {
    {
      /*Pasarle los default values una vez que cargue el user */
    }
    if (user) {
      reset({
        nick: user.nick,
        fullName: user.fullName,
        bio: user.bio,
      });
    }
  }, [user, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setFileSelected(file ? file : null);
    setFilePreview(file ? URL.createObjectURL(file) : null);
  };

  const editUser = async (data) => {
    const { status, message, userUpdated } = await Request(
      "user",
      "PUT",
      true,
      data,
    );

    if (status === "error") {
      setResult({ status, message });
      return;
    }

    if (fileSelected) {
      const formData = new FormData();
      formData.append("file0", fileSelected);

      const uploadReq = await fetch(url + "user/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const uploadResponse = await uploadReq.json();
      setUser(uploadResponse.user);
    } else {
      setResult({ status, message });
      setUser(userUpdated);
    }
  };

  return (
    <main className="bg-surface text-text-primary w-full rounded-2xl">
      <PageHeader title="Modificar perfil" />
      <form
        className="m-auto my-10 flex w-3/4 flex-col gap-4"
        onSubmit={handleSubmit(editUser)}
      >
        <label
          className="group relative cursor-pointer self-center overflow-hidden"
          htmlFor="avatar"
        >
          <ImagePlus className="absolute top-17 left-16 z-10 m-auto hidden size-15 group-hover:block" />
          <div className="group-hover:blur-[1px]">
            <Avatar
              src={
                filePreview ? filePreview : `${url}user/avatar/${user.image}`
              }
              size="4xl"
            />
          </div>
        </label>

        <input
          type="file"
          className="hidden"
          id="avatar"
          name="file0"
          onChange={handleFileChange}
        />

        <div className="flex w-full flex-col gap-2">
          <label className="text-text-secondary text-lg" htmlFor="nick">
            Nombre de usuario
          </label>
          <input
            type="text"
            className="border-border-input focus:border-primary rounded-2xl border p-4 text-xl focus:outline-none"
            id="nick"
            {...register("nick")}
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <label className="text-text-secondary text-lg" htmlFor="fullName">
            Nombre completo
          </label>
          <input
            type="text"
            className="border-border-input focus:border-primary rounded-2xl border p-4 text-xl focus:outline-none"
            id="fullName"
            {...register("fullName")}
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <label className="text-text-secondary text-lg" htmlFor="bio">
            Biografía
          </label>
          <textarea
            type="text"
            className="border-border-input focus:border-primary resize-none rounded-2xl border p-4 text-xl focus:outline-none"
            id="bio"
            {...register("bio")}
            rows={3}
          />
        </div>

        {result && <Alert status={result.status} message={result.message} />}

        <div className="mt-2 flex gap-2 self-end">
          <button
            className="bg-danger/80 hover:bg-danger flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2"
            onClick={() => navigate(-1)}
            type="button"
          >
            <span className="text-xl">Cancelar</span>
            <CircleX />
          </button>
          <button className="bg-primary hover:bg-primary-hover flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2">
            <span className="text-xl">Guardar</span>
            <CircleCheck />
          </button>
        </div>
      </form>
    </main>
  );
};
