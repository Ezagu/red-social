import { Avatar } from "../ui/Avatar";
import { MessageCircle } from "lucide-react";
import { Heart } from "lucide-react";
import { Link } from "react-router";
import { url } from "../../helpers/Global.jsx";
import { useLike } from "../../hooks/useLike.jsx";
import { useState } from "react";
import Request from "../../helpers/Request.jsx";
import { usePaginate } from "../../hooks/usePaginate.jsx";
import { Loading } from "../ui/Loading.jsx";

export const Comment = ({ comment }) => {
  const { liked, toggleLike, likesCount } = useLike({
    targetType: "Comment",
    target: comment,
  });

  const [repliesCount, setRepliesCount] = useState(comment.repliesCount);
  const [showReplies, setShowReplies] = useState(false);

  const {
    items: replies,
    loading,
    loadNextPage,
    load,
    paginate,
    addItem,
  } = usePaginate({
    endpoint: `comment/${comment._id}/replies`,
    limit: 3,
    autoLoad: false,
  });

  const createReplie = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;

    const response = await Request(`comment`, "POST", true, {
      publicationId: comment.publication,
      text,
      parentComment: comment._id,
    });

    if (response.status === "error") {
      return;
    }

    setRepliesCount((prev) => prev + 1);
    addItem(response.comment);
    e.target.text.value = "";
  };

  return (
    <article
      className={`border-border-input flex gap-2 border-t px-2 py-3 first:border-none ${paginate.hasNextPage && "last:border-b"}`}
    >
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
          <button
            className="group flex cursor-pointer items-center gap-1.5"
            onClick={() => {
              load();
              setShowReplies((prev) => !prev);
            }}
          >
            <div className="group-hover:text-primary transition-all group-hover:scale-125">
              <MessageCircle className="size-5.5" />
            </div>
            <span className="text-lg">{repliesCount}</span>
          </button>
          <button
            className="group flex cursor-pointer items-center gap-1.5"
            onClick={toggleLike}
          >
            <div className="group">
              <Heart
                className={`${liked ? "fill-primary text-primary" : ""} group-hover:text-primary size-6 transition-all group-hover:scale-125`}
              />
            </div>
            <span className="text-lg">{likesCount}</span>
          </button>
          <span className="text-text-secondary border-border-input border-l pl-3 text-xl">
            {comment.createdAt}
          </span>
        </div>
        {!showReplies ? (
          ""
        ) : loading ? (
          <Loading />
        ) : (
          <div className="flex flex-col">
            <form
              className={`flex gap-2 pt-2 ${repliesCount > 0 ? "border-border-input border-b pb-3 " : ""}`}
              onSubmit={(e) => createReplie(e)}
            >
              <input
                type="text"
                className="border-border-input placeholder:text-placeholder focus:border-primary text-text-primary text-md w-full rounded-xl border p-2 focus:outline-none"
                placeholder="Ingrese un comentario"
                required
                name="text"
              />
              <input
                type="submit"
                className="bg-primary cursor-pointer rounded-2xl px-4 text-lg font-semibold"
                value="Comentar"
              />
            </form>
            <ul>
              {replies.map((replie) => (
                <Comment comment={replie} key={replie._id} />
              ))}
            </ul>
            {paginate.hasNextPage && (
              <button
                className="bg-primary hover:bg-primary-hover text-text-primary m-auto mt-2 cursor-pointer rounded-2xl px-4 py-1 font-semibold"
                onClick={loadNextPage}
              >
                Ver más
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
