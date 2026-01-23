import React from "react";
import { UserRoundX } from "lucide-react";
import { UserRoundPlus } from "lucide-react";

export const ButtonFollowUnfollow = ({ following, className = "" }) => {
  return following ? (
    <button
      className={
        "bg-danger/80 hover:bg-danger flex cursor-pointer items-center gap-2 rounded-2xl px-3 py-1 " +
        className
      }
    >
      Dejar de seguir
      <UserRoundX className="size-5" />
    </button>
  ) : (
    <button
      className={
        "bg-primary hover:bg-primary-hover flex cursor-pointer items-center gap-2 rounded-2xl px-3 py-1 " +
        className
      }
    >
      Seguir
      <UserRoundPlus className="size-5" />
    </button>
  );
};
