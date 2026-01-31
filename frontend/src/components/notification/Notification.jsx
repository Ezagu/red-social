import { Link } from "react-router";
import ReactTimeAgo from "react-time-ago";
import { MessageCircle, X, Heart, UserPlus } from "lucide-react";
import { Avatar } from "../ui/Avatar";

export const Notification = ({ notification, read, deleteOne }) => {
  const data = {
    Comment: {
      icon: (
        <MessageCircle className="bg-surface fill-text-primary absolute -right-2 -bottom-1 size-6 rounded-full p-1" />
      ),
      message: `${notification.targetId?.parentComment ? "ha respondido tu comentario" : "ha comentado tu publicación"}`,
      link: `publication/${notification.targetId?.publication}`,
    },
    Like: {
      icon: (
        <Heart className="bg-surface absolute -right-2 -bottom-1 size-6 rounded-full fill-red-800 p-1 text-red-800" />
      ),
      message: ` le ha dado like a tu ${notification.targetId?.targetType === "Comment" ? "comentario" : "publicación"}`,
      link: `publication/${notification.targetId?.targetType === "Publication" ? notification.targetId?.targetId?._id : notification.targetId?.targetId?.publication}`,
    },
    Follow: {
      icon: (
        <UserPlus className="bg-surface text-primary fill-primary absolute -right-2 -bottom-1 size-6 rounded-full p-1" />
      ),
      message: ` comenzó a seguirte.`,
      link: `/profile/${notification.targetId.user}`,
    },
  };

  return (
    <Link
      className={`hover:bg-elevated relative flex items-center gap-4 rounded-2xl p-2 ${!notification.read && "bg-elevated"}`}
      to={data[notification.targetType].link}
      onClick={() => read(notification._id)}
    >
      <div className="relative shrink-0">
        <Avatar src={notification.fromUser.image} size="md" />
        {data[notification.targetType].icon}
      </div>
      <div className="flex min-w-0 flex-col">
        <div className="truncate overflow-hidden text-lg text-nowrap">
          <span className="font-bold">{notification.fromUser.nick}</span>{" "}
          {data[notification.targetType].message}
        </div>
        <p className="text-text-secondary bg-inherit text-sm">
          <ReactTimeAgo date={notification.createdAt} />
        </p>
      </div>
      <div
        className="text-text-muted hover:bg-danger hover:text-text-primary ml-auto shrink-0 justify-self-end rounded-full p-2 transition-all"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          deleteOne(notification._id);
        }}
      >
        <X className="size-6" />
      </div>
    </Link>
  );
};
