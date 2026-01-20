import React, { useState } from "react";
import { Avatar } from "../components/ui/Avatar";
import { CircleX } from "lucide-react";
import { CircleCheck } from "lucide-react";
import { ImagePlus } from "lucide-react";

export const Edit = () => {
  const [filePreview, setFilePreview] = useState(null);
  const [fileSelected, setFileSelected] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setFileSelected(file ? file : null);
    setFilePreview(file ? URL.createObjectURL(file) : null);
  };

  return (
    <main className="bg-surface text-text-primary w-full rounded-2xl">
      <form className="m-auto my-10 flex w-3/4 flex-col items-center gap-4">
        <label
          className="group relative cursor-pointer overflow-hidden"
          htmlFor="file0"
        >
          <ImagePlus className="absolute top-17 left-16 z-10 m-auto hidden size-15 group-hover:block" />
          <div className="group-hover:blur-[1px]">
            <Avatar
              src={filePreview ? filePreview : "/src/assets/agus.jpg"}
              size="4xl"
            />
          </div>
        </label>

        <input
          type="file"
          className="hidden"
          id="file0"
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
            name="nick"
            id="nick"
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <label className="text-text-secondary text-lg" htmlFor="fullName">
            Nombre completo
          </label>
          <input
            type="text"
            className="border-border-input focus:border-primary rounded-2xl border p-4 text-xl focus:outline-none"
            name="fullName"
            id="fullName"
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <label className="text-text-secondary text-lg" htmlFor="bio">
            Biografía
          </label>
          <textarea
            type="text"
            className="border-border-input focus:border-primary resize-none rounded-2xl border p-4 text-xl focus:outline-none"
            name="bio"
            id="bio"
            rows={3}
          />
        </div>

        <div className="mt-2 flex gap-2 self-end">
          <button className="bg-danger/80 hover:bg-danger flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2">
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
