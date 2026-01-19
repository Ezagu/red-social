import React from "react";
import { MessageCircle } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Link } from "react-router";
import { Heart } from "lucide-react";
import { UserPlus } from "lucide-react";

export const ListNotifications = ({ notifications }) => {
  const data = {
    Comment: {
      icon: (
        <MessageCircle className="bg-surface absolute -right-2 -bottom-1 size-6 rounded-full p-1" />
      ),
      message: `ha comentado tu publicación.`,
      link: "",
    },
    Like: {
      icon: (
        <Heart className="bg-surface absolute -right-2 -bottom-1 size-6 rounded-full p-1 text-red-800" />
      ),
      message: `ha dado me gusta a tu publicación.`,
      link: "",
    },
    Follow: {
      icon: (
        <UserPlus className="bg-surface text-primary absolute -right-2 -bottom-1 size-6 rounded-full p-1" />
      ),
      message: `ha comenzado a seguirte.`,
      link: "",
    },
  };

  return (
    <div className="flex flex-col gap-2 p-4 pt-0">
      {notifications.map((notification) => (
        <Link
          className={
            "hover:bg-elevated relative flex items-center gap-4 rounded-2xl p-2" +
            (!notification.read ? " bg-elevated" : "")
          }
          key={notification.id}
        >
          <div className="relative">
            <Avatar src={notification.fromUser.image} size="md" />
            {data[notification.targetType].icon}
          </div>
          <div className="text-md overflow-hidden text-nowrap">
            <span className="font-bold">{notification.fromUser.nick}</span>{" "}
            {data[notification.targetType].message}
          </div>
          <p className="text-text-secondary absolute top-1 right-2 bg-inherit">
            3d
          </p>
        </Link>
      ))}
    </div>
  );
};
