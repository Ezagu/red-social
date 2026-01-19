import React from "react";

export const Avatar = ({ size, src }) => {
  return (
    <div>
      <img
        src={src}
        className={`size-${size} rounded-full object-cover`}
        alt="avatar"
      />
    </div>
  );
};
