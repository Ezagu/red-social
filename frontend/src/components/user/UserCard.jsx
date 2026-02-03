import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../hooks/useAuth.jsx";
import { Avatar } from "../../components/ui/Avatar.jsx";
import { ButtonUnfollow } from "../ui/ButtonUnfollow.jsx";
import { ButtonFollow } from "../ui/ButtonFollow.jsx";

export const UserCard = ({ user }) => {
  const { user: identity } = useAuth();
  const [profile, setProfile] = useState(user);

  return (
    <Link
      to={"/profile/" + profile?._id}
      className="bg-surface hover:bg-elevated relative flex w-full items-center gap-3 rounded-2xl px-4 py-2"
    >
      <Avatar src={user.image} size="lg" />
      <div className="w-full min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate text-xl font-semibold">{user.nick}</span>
          {profile._id.toString() !== identity._id.toString() &&
            profile.isFollower && (
              <span className="bg-elevated shrink-0 rounded-2xl px-1.5 py-0.5 text-sm">
                Te sigue
              </span>
            )}
        </div>
        <p className="text-text-muted -mt-1 truncate">{user.fullName}</p>
        <p className="truncate">{user.bio}</p>
        <div className="absolute top-2 right-2">
          {profile._id.toString() !== identity._id.toString() &&
            (profile.isFollowed ? (
              <ButtonUnfollow
                profile={profile}
                setProfile={setProfile}
                size="sm"
              />
            ) : (
              <ButtonFollow
                profile={profile}
                setProfile={setProfile}
                size="sm"
              />
            ))}
        </div>
      </div>
    </Link>
  );
};
