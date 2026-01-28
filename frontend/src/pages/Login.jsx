import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { PasswordInput } from "../components/ui/PasswordInput";
import { useForm } from "react-hook-form";
import request from "../helpers/Request";
import { Alert } from "../components/ui/Alert";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/ui/Input";
import { Loading } from "../components/ui/Loading";
import { LoaderCircle } from "lucide-react";

export const Login = () => {
  const { register, handleSubmit } = useForm();
  const [alert, setAlert] = useState();
  const { user, loading, setUser } = useAuth();
  const [waitingResponse, setWaitingResponse] = useState(false);

  const navigate = useNavigate();

  const login = async (data) => {
    setWaitingResponse(true);
    setAlert(null);

    const response = await request("user/login", "POST", null, data);

    setWaitingResponse(false);
    setAlert(response);

    if (response.status === "success") {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      setUser(response.user);

      navigate("/");
    }
  };

  return (
    <div className="text-text-primary flex h-dvh items-center justify-center">
      <section className="grid w-full max-w-6xl grid-cols-2 px-10">
        {loading ? (
          <Loading className="col-span-2" />
        ) : user._id ? (
          navigate("/")
        ) : (
          <>
            <div className="mt-10">
              <h1 className="mb-4 text-7xl font-light">
                <span className="font-bold">REACT</span>social
              </h1>
              <p className="text-text-secondary text-2xl font-extralight tracking-wider">
                Diseñada para comunicar, pensada para conectar.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <form
                className="bg-surface flex flex-col gap-6 rounded-2xl px-10 py-10"
                onSubmit={handleSubmit(login)}
                onChange={() => alert && setAlert(null)}
              >
                {alert && (
                  <Alert message={alert.message} status={alert.status} />
                )}

                <Input
                  register={register}
                  registerName={"email"}
                  placeholder="Email o Nombre de Usuario"
                />

                <PasswordInput register={register} />

                <button
                  type="submit"
                  className={`bg-primary flex w-full items-center justify-center gap-2 rounded-xl border border-none p-3 text-lg font-bold transition-all ${waitingResponse ? "bg-primary/50" : " hover:bg-primary-hover cursor-pointer"}`}
                  {...{ disabled: waitingResponse }}
                >
                  {waitingResponse && (
                    <LoaderCircle className="size-6 animate-spin" />
                  )}
                  {waitingResponse ? "Iniciando Sesión" : "Inciar Sesión"}
                </button>
              </form>
              <div className="rounded-2xl bg-gray-900 px-10 py-4 text-center">
                <p>
                  ¿Todavía no tenés una cuenta?{" "}
                  <Link to="/register" className="text-primary hover:underline">
                    Regístrate
                  </Link>
                </p>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};
