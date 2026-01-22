const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    bio: String,
    nick: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "role_user",
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "default.jpg",
    },
    followingCount: {
      type: Number,
      default: 0,
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    publicationsCount: {
      type: Number,
      default: 0,
    },
    unreadNotificationsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ nick: 1 }, { unique: true });

UserSchema.plugin(mongoosePaginate);

module.exports = model("User", UserSchema, "users");
