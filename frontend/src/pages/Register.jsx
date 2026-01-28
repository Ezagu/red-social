import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Alert } from "../components/ui/Alert";
import { PasswordInput } from "../components/ui/PasswordInput";
import { useForm } from "react-hook-form";
import Request from "../helpers/Request";
import { Input } from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import { Loading } from "../components/ui/Loading";

export const Register = () => {
  const { user, loading } = useAuth();

  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();
  const [alert, setAlert] = useState(null);

  const signin = async (data) => {
    const response = await Request("user/register", "POST", null, data);
    setAlert(response);
  };

  return (
    <div className="text-text-primary flex h-dvh items-center justify-center">
      <div className="flex w-full max-w-lg flex-col gap-4">
        {loading ? (
          <Loading />
        ) : user._id ? (
          navigate("/")
        ) : (
          <>
            <h1 className="mb-4 self-center text-7xl font-light">
              <span className="font-bold">REACT</span>social
            </h1>
            <form
              className="bg-surface flex flex-col gap-6 rounded-2xl px-10 py-10"
              onSubmit={handleSubmit(signin)}
              onChange={() => {
                alert && setAlert(null);
              }}
            >
              {alert && <Alert status={alert.status} message={alert.message} />}

              <Input
                register={register}
                registerName="email"
                placeholder="Email"
              />

              <PasswordInput register={register} />

              <Input
                register={register}
                registerName="fullName"
                placeholder="Nombre completo"
              />

              <Input
                register={register}
                registerName="nick"
                placeholder="Nombre de usuario"
              />

              <input
                type="submit"
                className="bg-primary hover:bg-primary-hover w-full cursor-pointer rounded-xl border border-none p-3 text-lg font-bold transition-all"
                value="Registrarse"
              />
            </form>
            <div className="bg-surface rounded-2xl px-10 py-4 text-center">
              <p>
                ¿Ya tenés una cuenta?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
