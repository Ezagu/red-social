import { useProfile } from "./useProfile";
import { followUser, unfollowUser } from "../services/follow.services";
import { useAuth } from "./useAuth";

export const useFollow = ({ profile, setProfile }) => {
  const { user, setUser } = useAuth();
  const { profile: profileCache, setProfile: setProfileCache } = useProfile();

  const follow = async () => {
    await followUser(profile._id);

    setProfile((prev) => ({
      ...prev,
      isFollowed: true,
    }));
    setUser((prev) => ({ ...prev, followingCount: prev.followingCount + 1 }));

    if (profileCache._id.toString() === profile._id.toString()) {
      setProfileCache((prev) => ({
        ...prev,
        followersCount: prev.followersCount + 1,
        isFollowed: true,
      }));
    }
    if (profileCache._id.toString() === user._id.toString()) {
      setProfileCache((prev) => ({
        ...prev,
        followingCount: prev.followingCount + 1,
      }));
    }
  };

  const unfollow = async () => {
    await unfollowUser(profile._id);

    setProfile((prev) => ({
      ...prev,
      isFollowed: false,
    }));
    setUser((prev) => ({ ...prev, followingCount: prev.followingCount - 1 }));

    if (profileCache._id.toString() === profile._id.toString()) {
      setProfileCache((prev) => ({
        ...prev,
        followersCount: prev.followersCount - 1,
        isFollowed: false,
      }));
    }
    if (profileCache._id.toString() === user._id.toString()) {
      setProfileCache((prev) => ({
        ...prev,
        followingCount: prev.followingCount - 1,
      }));
    }
  };

  return {
    follow,
    unfollow,
  };
};
