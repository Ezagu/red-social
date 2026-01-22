import { Avatar } from "../ui/Avatar";
import { MessageCircle } from "lucide-react";
import { Heart } from "lucide-react";
import { Link } from "react-router";
import { Input } from "../ui/Input.jsx";

export const Comment = () => {
  return (
    <article className="border-border-input flex gap-2 border-t px-2 py-3">
      <Link>
        <Avatar src="/src/assets/agus.jpg" size="lg" />
      </Link>
      <div className="w-full">
        <Link className="text-lg font-semibold">Ezagu</Link>
        <p className="text-lg">Que buena imagen che!</p>
        <div className="mt-2 flex gap-4">
          <div className="flex cursor-pointer items-center gap-1.5">
            <div>
              <MessageCircle className="size-5.5" />
            </div>
            <span className="text-lg">1</span>
          </div>
          <button className="flex cursor-pointer items-center gap-1.5">
            <div>
              <Heart className="fill-primary text-primary size-6" />
            </div>
            <span className="text-lg">1</span>
          </button>
          <span className="text-text-secondary border-l pl-3 text-xl">6h</span>
        </div>
      </div>
    </article>
  );
};
