const Follow = require('../models/follow.js');

const followUserIds = async (identityUserId) => {
  // Devuelve array con los ids de los usuarios que sigo y me siguen
  try {
    // Sacar info de seguimiento
    const following = await Follow.find({'user': identityUserId}, 'followed -_id');
    const followers = await Follow.find({'followed': identityUserId}, 'user -_id');

    // Procesar array de identificadores
    const followingClean = [];
    following.forEach(follow => followingClean.push(follow.followed));

    const followersClean = [];
    followers.forEach(follow => followersClean.push(follow.user));

    return {
      following: followingClean,
      followers: followersClean
    }
  } catch(error) {
    return {};
  }
}

const followThisUser = async (identityUserId, profileUserId) => {
  try {
    // Sacar info de seguimiento
    const following = await Follow.findOne({'user': identityUserId, 'followed': profileUserId});
    const follower = await Follow.findOne({'user': profileUserId, 'followed': identityUserId});

    return {
      following,
      follower
    }
  } catch(error) {
    return {};
  }
}

module.exports = {
  followUserIds,
  followThisUser
}