import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export const PageHeader = ({ title }) => {
  const navigate = useNavigate();

  return (
    <header className="border-border-input flex w-full items-center gap-4 border-b p-4">
      <button className="cursor-pointer" onClick={() => navigate(-1)}>
        <ArrowLeft />
      </button>
      <h1 className="truncate text-2xl font-semibold">{title}</h1>
    </header>
  );
};
