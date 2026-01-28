import React, { useState } from "react";
import { EyeOff } from "lucide-react";
import { Eye } from "lucide-react";

export const PasswordInput = ({ register, placeholder = "Contraseña" }) => {
  const [moveLabel, setMoveLabel] = useState(false);

  const [watch, setWatch] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  return (
    <div className="relative">
      <input
        {...register("password", {
          onChange: (e) => {
            console.log(e.target.value);
            e.target.value !== "" ? setShowIcon(true) : setShowIcon(false);
          },
          onBlur: (e) => {
            setWatch((prev) => prev && e.target.value !== "");
            setMoveLabel(e.target.value !== "");
          },
        })}
        type={watch ? "text" : "password"}
        className="border-border-input placeholder:text-placeholder focus:border-primary w-full rounded-xl border p-3 text-lg focus:outline-none"
        onFocus={() => setMoveLabel(true)}
      />
      <label
        className={`text-placeholder pointer-events-none absolute text-lg transition-all ${
          moveLabel
            ? " bg-surface -top-2.5 left-3 px-1 text-sm"
            : "top-1/2 left-4 -translate-y-1/2"
        }`}
      >
        {placeholder}
      </label>
      {showIcon && (
        <button
          className="text-border-input hover:text-text-secondary absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
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
