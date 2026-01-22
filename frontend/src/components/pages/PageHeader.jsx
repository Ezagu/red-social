import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export const PageHeader = ({ title }) => {
  const navigate = useNavigate();

  return (
    <header className="border-border-input mt-4 mb-4 flex w-full items-center gap-4 border-b px-4 pb-4">
      <button className="cursor-pointer" onClick={() => navigate(-1)}>
        <ArrowLeft />
      </button>
      <h1 className="text-2xl font-semibold">{title}</h1>
    </header>
  );
};
