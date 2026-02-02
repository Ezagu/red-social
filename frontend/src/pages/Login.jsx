import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import request from "../helpers/Request";
import { PasswordInput } from "../components/ui/PasswordInput";
import { Alert } from "../components/ui/Alert";
import { Input } from "../components/ui/Input";
import { Loading } from "../components/ui/Loading";
import { ButtonLoading } from "../components/ui/ButtonLoading";

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
    } else {
      setWaitingResponse(false);
    }
  };

  return (
    <div className="text-text-primary flex h-dvh items-center justify-center">
      <section className="flex w-full max-w-6xl flex-col items-center px-10 lg:grid lg:grid-cols-2 lg:items-start">
        {loading ? (
          <Loading className="col-span-2" />
        ) : user._id ? (
          navigate("/")
        ) : (
          <>
            <div className="mt-10">
              <h1 className="mb-8 text-7xl font-light lg:mb-4">
                <span className="font-bold">REACT</span>social
              </h1>
              <p className="text-text-secondary hidden text-2xl font-extralight tracking-wider lg:block">
                Diseñada para comunicar, pensada para conectar.
              </p>
            </div>

            <div className="flex w-full max-w-lg flex-col gap-4">
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

                <ButtonLoading type="submit" loading={waitingResponse}>
                  {waitingResponse ? "Iniciando Sesión" : "Inciar Sesión"}
                </ButtonLoading>
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
