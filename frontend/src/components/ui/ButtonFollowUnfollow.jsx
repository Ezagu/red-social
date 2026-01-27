import React, { useState } from "react";
import { UserRoundX } from "lucide-react";
import { UserRoundPlus } from "lucide-react";
import Request from "../../helpers/Request";
import { useAuth } from "../../hooks/useAuth";

export const ButtonFollowUnfollow = ({
  profile,
  setProfile,
  className = "",
}) => {
  const { setUser } = useAuth();
  const [following, setFollowing] = useState(profile.isFollowed);

  const follow = async () => {
    const response = await Request(`follow/${profile._id}`, "POST");

    if (response.status === "success") {
      setFollowing(true);

      // Modifica valores de seguidores en el perfil visualizado
      setProfile &&
        setProfile((prevProf) => ({
          ...prevProf,
          isFollowed: true,
          followersCount: prevProf.followersCount + 1,
        }));
      // Modifica valores de seguidos del usuario identificado
      setUser((prevUser) => ({
        ...prevUser,
        followingCount: prevUser.followingCount + 1,
      }));
    }
  };

  const unfollow = async () => {
    const response = await Request(`follow/${profile._id}`, "DELETE");

    if (response.status === "success") {
      setFollowing(false);
      setProfile &&
        setProfile((prevProf) => ({
          ...prevProf,
          isFollowed: false,
          followersCount: prevProf.followersCount - 1,
        }));

      setUser((prevUser) => ({
        ...prevUser,
        followingCount: prevUser.followingCount - 1,
      }));
    }
  };

  return following ? (
    <button
      className={
        "bg-danger/80 hover:bg-danger flex cursor-pointer items-center gap-2 rounded-2xl px-3 py-1 " +
        className
      }
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        unfollow();
      }}
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
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        follow();
      }}
    >
      Seguir
      <UserRoundPlus className="size-5" />
    </button>
  );
};
