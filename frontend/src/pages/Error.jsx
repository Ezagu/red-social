import { Link } from "react-router";
import React from "react";
import { ArrowLeft } from "lucide-react";

export const Error = () => {
  return (
    <main className="text-text-primary bg-surface flex flex-col items-center justify-center rounded-2xl py-30">
      <h1 className="text-6xl font-extrabold">ERROR 404</h1>
      <h2 className="text-text-secondary mt-1 text-3xl font-bold">
        Página no encontrada
      </h2>
      <Link
        to="/"
        className="text-text-secondary hover:text-primary mt-10 flex gap-2 text-xl font-bold transition-all hover:underline"
      >
        <ArrowLeft />
        Volver al inicio
      </Link>
    </main>
  );
};
