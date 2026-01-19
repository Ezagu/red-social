import React from "react";
import { Link } from "react-router";
import { Alert } from "../components/ui/Alert";
import { PasswordInput } from "../components/ui/PasswordInput";

export const Register = () => {
  return (
    <div className="text-text-primary flex h-dvh items-center justify-center">
      <div className="flex w-full max-w-lg flex-col gap-4">
        <h1 className="mb-4 self-center text-7xl font-light">
          <span className="font-bold">REACT</span>social
        </h1>
        <form className="bg-surface flex flex-col gap-6 rounded-2xl px-10 py-10">
          <Alert status="error" msg="No se pudo crear el usuario" />

          <input
            type="email"
            className="border-border-input focus:border-primary placeholder:text-placeholder w-full rounded-xl border p-3 text-lg focus:outline-none"
            placeholder="Email"
          />
          <PasswordInput />
          <input
            type="text"
            className="border-border-input focus:border-primary placeholder:text-placeholder w-full rounded-xl border p-3 text-lg focus:outline-none"
            placeholder="Nombre completo"
          />
          <input
            type="text"
            className="border-border-input focus:border-primary placeholder:text-placeholder w-full rounded-xl border p-3 text-lg focus:outline-none"
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
      </div>
    </div>
  );
};
