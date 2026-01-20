import React from "react";
import { UserRoundX } from "lucide-react";
import { UserRoundPlus } from "lucide-react";

export const ButtonFollowUnfollow = ({ following }) => {
  return following ? (
    <button className="bg-danger/80 hover:bg-danger absolute top-3 right-4 flex cursor-pointer items-center gap-2 rounded-2xl px-3 py-1">
      Dejar de seguir
      <UserRoundX className="size-5" />
    </button>
  ) : (
    <button className="bg-primary hover:bg-primary-hover absolute top-3 right-4 flex cursor-pointer items-center gap-2 rounded-2xl px-3 py-1">
      Seguir
      <UserRoundPlus className="size-5" />
    </button>
  );
};
