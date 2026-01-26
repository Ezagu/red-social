import React from "react";
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

  const follow = async () => {
    const response = await Request(`follow/${profile._id}`, "POST");

    if (response.status === "success") {
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

  return profile.isFollowed ? (
    <button
      className={
        "bg-danger/80 hover:bg-danger flex cursor-pointer items-center gap-2 rounded-2xl px-3 py-1 " +
        className
      }
      onClick={unfollow}
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
      onClick={follow}
    >
      Seguir
      <UserRoundPlus className="size-5" />
    </button>
  );
};
