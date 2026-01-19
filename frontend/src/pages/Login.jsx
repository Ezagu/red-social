import React from "react";
import { Link } from "react-router";
import { PasswordInput } from "../components/ui/PasswordInput";

export const Login = () => {
  return (
    <div className="text-text-primary flex h-dvh items-center justify-center">
      <section className="grid w-full max-w-6xl grid-cols-2 px-10">
        <div className="mt-10">
          <h1 className="mb-4 text-7xl font-light">
            <span className="font-bold">REACT</span>social
          </h1>
          <p className="text-text-secondary text-2xl font-extralight tracking-wider">
            Diseñada para comunicar, pensada para conectar.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <form className="bg-surface flex flex-col gap-6 rounded-2xl px-10 py-10">
            <input
              type="text"
              className="border-border-input placeholder:text-placeholder focus:border-primary w-full rounded-xl border p-3 text-lg focus:outline-none"
              placeholder="Email o nombre de usuario"
            />
            <PasswordInput />

            <input
              type="submit"
              className="bg-primary hover:bg-primary-hover w-full cursor-pointer rounded-xl border border-none p-3 text-lg font-bold transition-all"
              value="Iniciar Sesión"
            />
            <Link className="lace-self-start text-text-secondary -my-2 self-center hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
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
      </section>
    </div>
  );
};
