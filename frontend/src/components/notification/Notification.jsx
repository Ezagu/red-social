import React from "react";
import { MessageCircle } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Link } from "react-router";
import { Heart } from "lucide-react";
import { UserPlus } from "lucide-react";

export const Notification = () => {
  const data = {
    Comment: {
      icon: (
        <MessageCircle className="bg-surface fill-text-primary absolute -right-2 -bottom-1 size-6 rounded-full p-1" />
      ),
      message: `ha comentado tu publicación.`,
      link: "",
    },
    Like: {
      icon: (
        <Heart className="bg-surface absolute -right-2 -bottom-1 size-6 rounded-full fill-red-800 p-1 text-red-800" />
      ),
      message: `ha dado me gusta a tu publicación.`,
      link: "",
    },
    Follow: {
      icon: (
        <UserPlus className="bg-surface text-primary fill-primary absolute -right-2 -bottom-1 size-6 rounded-full p-1" />
      ),
      message: `ha comenzado a seguirte.`,
      link: "",
    },
  };
  return (
    <Link
      className={
        "hover:bg-elevated relative flex items-center gap-4 rounded-2xl p-2"
      }
    >
      <div className="relative">
        <Avatar src="/src/assets/kiara.jpg" size="md" />
        {data.Like.icon}
      </div>
      <div className="text-md overflow-hidden text-nowrap">
        <span className="font-bold">Dkiara03</span> Ha dado me gusta a tu
        publicacion
      </div>
      <p className="text-text-secondary absolute top-1 right-2 bg-inherit">
        3d
      </p>
    </Link>
  );
};
