import React from "react";
import { LoaderCircle } from "lucide-react";

export const Loading = ({ className = "" }) => {
  return (
    <LoaderCircle
      className={`${className} text-primary m-auto size-15 animate-spin`}
    />
  );
};
