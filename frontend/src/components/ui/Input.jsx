import React from "react";

export const Input = ({ type = "text", placeholder, name, id }) => {
  console.log(placeholder);

  return (
    <input
      type={type}
      className="border-border-input placeholder:text-placeholder focus:border-primary text-text-primary w-full rounded-xl border p-3 text-lg focus:outline-none"
      placeholder={placeholder}
      name={name}
      id={id}
    />
  );
};
