import { Avatar } from "../ui/Avatar";
import { MessageCircle } from "lucide-react";
import { Heart } from "lucide-react";
import { Link } from "react-router";
import { Input } from "../ui/Input.jsx";
import { url } from "../../helpers/Global.jsx";

export const Comment = ({ comment }) => {
  return (
    <article className="border-border-input flex gap-2 border-t px-2 py-3">
      <Link to={`/profile/${comment.user._id}`} className="shrink-0">
        <Avatar src={`${url}user/avatar/${comment.user.image}`} size="lg" />
      </Link>
      <div className="w-full">
        <Link
          to={`/profile/${comment.user._id}`}
          className="text-lg font-semibold"
        >
          {comment.user.nick}
        </Link>
        <p className="text-xl">{comment.text}</p>
        <div className="text-text-secondary mt-2 flex gap-4">
          <button className="flex cursor-pointer items-center gap-1.5">
            <div>
              <MessageCircle className="size-5.5" />
            </div>
            <span className="text-lg">{comment.repliesCount}</span>
          </button>
          <button className="flex cursor-pointer items-center gap-1.5">
            <div>
              <Heart className="fill-primary text-primary size-6" />
            </div>
            <span className="text-lg">{comment.likesCount}</span>
          </button>
          <span className="text-text-secondary border-border-input border-l pl-3 text-xl">
            {comment.createdAt}
          </span>
        </div>
      </div>
    </article>
  );
};
