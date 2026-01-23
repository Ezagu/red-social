import React from "react";
import { Link } from "react-router";
import { ButtonFollowUnfollow } from "../ui/ButtonFollowUnfollow";
import { Avatar } from "../../components/ui/Avatar.jsx";
import { url } from "../../helpers/Global.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";

export const UserCard = ({ user }) => {
  const { user: identity } = useAuth();

  return (
    <Link
      to={"/profile/" + user._id}
      className="bg-surface hover:bg-elevated relative flex w-full items-center gap-3 rounded-2xl px-4 py-2"
    >
      <Avatar src={url + "user/avatar/" + user.image} size="lg" />
      <div className="w-full min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate text-xl font-semibold">{user.nick}</span>
          {user.isFollower && user._id !== identity._id && (
            <span className="bg-elevated shrink-0 rounded-2xl px-1.5 py-0.5 text-sm">
              Te sigue
            </span>
          )}
        </div>
        <p className="text-text-muted -mt-1 truncate">{user.fullName}</p>
        <p className="truncate">{user.bio}</p>
      </div>
      {user._id !== identity._id && (
        <ButtonFollowUnfollow
          following={user.isFollowed}
          className="shrink-0"
        />
      )}
    </Link>
  );
};
