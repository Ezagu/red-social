import React from "react";
import { CircleCheck } from "lucide-react";
import { CircleX } from "lucide-react";

export const Alert = ({ status, message }) => {
  return (
    <div
      className={`flex gap-2 rounded-3xl ${status === "success" ? "bg-success" : "bg-danger"} items-center px-2 py-3 text-lg transition-all`}
    >
      {status === "success" ? (
        <CircleCheck className="ml-1" />
      ) : (
        <CircleX className="ml-1" />
      )}
      <p>{message}</p>
    </div>
  );
};
