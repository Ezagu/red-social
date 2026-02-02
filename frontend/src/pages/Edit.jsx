import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { ImagePlus } from "lucide-react";
import { useEdit } from "../hooks/useEdit";
import { useAuth } from "../hooks/useAuth";
import { useFilePreview } from "../hooks/useFilePreview";
import { Avatar } from "../components/ui/Avatar";
import { Alert } from "../components/ui/Alert";
import { PageWithHeader } from "../components/pages/PageWithHeader";
import { ButtonLoading } from "../components/ui/ButtonLoading";
import { RedButton } from "../components/ui/RedButton";

export const Edit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const inputRef = useRef();
  const { preview, handlePreview } = useFilePreview(inputRef);
  const { editProfile, loading, result, clearResult } = useEdit(inputRef);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm();

  useEffect(() => {
    user &&
      reset({
        nick: user.nick,
        fullName: user.fullName,
        bio: user.bio,
        file: null,
      });
  }, [user, reset]);

  return (
    <PageWithHeader title={"Modificar perfil"}>
      <form
        className="m-auto my-10 flex w-3/4 flex-col gap-4"
        onSubmit={handleSubmit(editProfile)}
        onChange={() => result && clearResult()}
      >
        <label
          className="group relative cursor-pointer self-center overflow-hidden"
          htmlFor="avatar"
        >
          <ImagePlus className="absolute top-17 left-16 z-10 m-auto hidden size-15 group-hover:block" />
          <div className="group-hover:blur-[1px]">
            <Avatar src={preview ? preview : user.image} size="4xl" />
          </div>
        </label>

        <input
          type="file"
          id="avatar"
          className="hidden"
          {...register("file", {
            onChange: (e) => {
              handlePreview(e);
            },
          })}
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
          <RedButton onClick={() => navigate(-1)} className="text-xl">
            Cancelar
          </RedButton>
          <ButtonLoading
            loading={loading}
            type="submit"
            className={
              (!isDirty
                ? "bg-primary/50 hover:bg-primary/50 hover:cursor-default "
                : "") + "text-xl"
            }
            {...(!isDirty && { disabled: true })}
          >
            {loading ? "Actualizando" : "Actualizar"}
          </ButtonLoading>
        </div>
      </form>
    </PageWithHeader>
  );
};
