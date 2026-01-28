import React, { useState } from "react";

export const Input = ({
  register,
  registerName,
  type = "text",
  placeholder = "",
}) => {
  const [moveLabel, setMoveLabel] = useState(false);

  return (
    <div className="relative">
      <input
        type={type}
        className="border-border-input group focus:border-primary text-text-primary w-full rounded-xl border p-3 px-4 text-lg focus:outline-none"
        {...register(registerName, {
          onBlur: (e) => setMoveLabel(e.target.value !== ""),
        })}
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
    </div>
  );
};
