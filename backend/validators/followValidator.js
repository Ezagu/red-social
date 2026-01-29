const { param } = require("express-validator");
const validateFields = require("./validateFields");
const mongoose = require("mongoose");
const Follow = require("../models/follow");
const { mustExistUser, isObjectId } = require("./customs");

const mustNotExistFollow = async (value, { req }) => {
  const follow = await Follow.findOne({ user: req.user._id, followed: value });
  if (follow) throw new Error("Ya sigues a este usuario");
  return true;
};

const mustExistFollow = async (value, { req }) => {
  const follow = await Follow.findOne({ user: req.user._id, followed: value });
  if (!follow) throw new Error("No sigues a este usuario");
  return true;
};

const cannotFollowYourself = async (value, { req }) => {
  if (req.user._id.toString() === value.toString())
    throw new Error("No te puedes seguir a ti mismo");
  return true;
};

const cannotUnfollowYourself = async (value, { req }) => {
  if (req.user._id.toString() === value.toString())
    throw new Error("No te puedes dejar de seguir a ti mismo");
  return true;
};

const followedBase = () =>
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Debes enviar un usuario")
    .custom(isObjectId)
    .custom(mustExistUser);

exports.follow = [
  [followedBase().custom(cannotFollowYourself).custom(mustNotExistFollow)],
  validateFields,
];

exports.unfollow = [
  [followedBase().custom(cannotUnfollowYourself).custom(mustExistFollow)],
  validateFields,
];
