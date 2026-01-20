import React from "react";

export const Avatar = ({ size, src }) => {
  const sizes = {
    sm: "size-8",
    md: "size-12",
    lg: "size-16",
    xl: "size-24",
    "2xl": "size-30",
    "3xl": "size-36",
    "4xl": "size-48",
  };

  return (
    <div>
      <img
        src={src}
        className={`${sizes[size]} rounded-full object-cover`}
        alt="avatar"
      />
    </div>
  );
};
