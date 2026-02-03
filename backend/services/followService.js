const Follow = require("../models/follow.js");

const followsIds = async (userId) => {
  return {
    following: await followingIds(userId),
    followers: await followersIds(userId),
  };
};

const followersIds = async (userId) => {
  try {
    const followersObj = await Follow.find({ followed: userId }, "user");

    const followers = [];
    followersObj.forEach((follow) => followers.push(follow.user.toString()));

    return followers;
  } catch (err) {
    return null;
  }
};

const followingIds = async (userId) => {
  try {
    const followingObj = await Follow.find({ user: userId }, "followed");

    const following = [];
    followingObj.forEach((follow) =>
      following.push(follow.followed.toString()),
    );

    return following;
  } catch (err) {
    return null;
  }
};

const addMyFollowInfo = async (users, userIdentityId) => {
  const follows = await followsIds(userIdentityId);
  return users.map((user) => {
    const id = user._id.toString();
    return {
      ...user.toObject(),
      isFollower:
        user._id === userIdentityId
          ? null
          : follows.followers.includes(id)
            ? true
            : false,
      isFollowed:
        user._id === userIdentityId
          ? null
          : follows.following.includes(id)
            ? true
            : false,
    };
  });
};

const followThisUser = async (identityUserId, profileUserId) => {
  try {
    // Sacar info de seguimiento
    const following = await Follow.findOne({
      user: identityUserId,
      followed: profileUserId,
    });
    const follower = await Follow.findOne({
      user: profileUserId,
      followed: identityUserId,
    });

    return {
      following,
      follower,
    };
  } catch (error) {
    return {};
  }
};

module.exports = {
  followsIds,
  followThisUser,
  followersIds,
  followingIds,
  addMyFollowInfo,
};
