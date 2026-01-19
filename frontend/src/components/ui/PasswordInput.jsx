import React, { useState } from "react";
import { EyeOff } from "lucide-react";
import { Eye } from "lucide-react";

export const PasswordInput = () => {
  const [watch, setWatch] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  return (
    <div className="relative">
      <input
        type={watch ? "text" : "password"}
        className="border-border-input placeholder:text-placeholder focus:border-primary w-full rounded-xl border p-3 text-lg focus:outline-none"
        placeholder="Contraseña"
        onChange={(e) =>
          e.target.value ? setShowIcon(true) : setShowIcon(false)
        }
      />
      {showIcon && (
        <button
          className="text-border-input hover:text-text-secondary absolute top-4 right-4 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            setWatch((prev) => !prev);
          }}
        >
          {watch ? <Eye /> : <EyeOff />}
        </button>
      )}
    </div>
  );
};
