import React from "react";
import { LoaderCircle } from "lucide-react";

export const Loading = ({ className = "" }) => {
  return (
    <LoaderCircle
      className={`text-primary m-auto mt-10 size-15 animate-spin ${className}`}
    />
  );
};
