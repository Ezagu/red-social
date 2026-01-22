import React from "react";
import { Link } from "react-router";
import { ButtonFollowUnfollow } from "../ui/ButtonFollowUnfollow";
import { Avatar } from "../../components/ui/Avatar.jsx";

export const UserCard = () => {
  return (
    <Link className="bg-surface hover:bg-elevated relative flex w-full items-center gap-3 rounded-2xl px-4 py-2">
      <Avatar src="/src/assets/kiara.jpg" size="lg" />
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold">dkiara03</span>
          <span className="bg-elevated rounded-2xl px-1.5 py-0.5 text-sm">
            Te sigue
          </span>
        </div>
        <p className="text-text-muted -mt-1">Kiara Duarte</p>
        <p>Tengo al mejor novio del mundoooo</p>
      </div>
      <ButtonFollowUnfollow following={false} />
    </Link>
  );
};
