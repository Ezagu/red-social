import { Link, useNavigate } from "react-router";
import ReactTimeAgo from "react-time-ago";
import { MessageCircle, Trash2, Heart } from "lucide-react";
import { useLike } from "../../hooks/useLike.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useProfileCache } from "../../hooks/useProfileCache.jsx";
import { Avatar } from "../../components/ui/Avatar.jsx";
import Request from "../../helpers/Request.jsx";

export const Publication = ({ mode = "feed", publication, removeItem }) => {
  //Cambiar tipo de publicacion para feed o pagina
  const isFeed = mode === "feed";

  const Wrapper = isFeed ? Link : "div";
  const WrapperProps = isFeed ? { to: "/publication/" + publication._id } : {};

  const { setProfileCache } = useProfileCache();

  const { user, setUser } = useAuth();
  const { liked, likesCount, toggleLike } = useLike({
    target: publication,
    targetType: "Publication",
  });
  const navigate = useNavigate();

  const removePublication = async () => {
    const response = await Request(`publication/${publication._id}`, "DELETE");
    if (response.status === "error") {
      return;
    }
    removeItem && removeItem(publication._id);
    setUser((prev) => ({
      ...prev,
      publicationsCount: prev.publicationsCount - 1,
    }));
    !isFeed && navigate(-1);
    setProfileCache((prev) => ({
      ...prev,
      publicationsCount: prev.publicationsCount - 1,
    }));
  };

  return (
    <article
      className={`${isFeed ? "border-border-input border-t first:pt-2" : ""} pt-4 first:border-t-0`}
    >
      <header className="flex items-center gap-2 px-4">
        <Link to={"/profile/" + publication.user._id} className="shrink-0">
          <Avatar src={publication.user.image} size="lg" />
        </Link>
        <div>
          <Link
            className="text-xl font-semibold"
            to={"/profile/" + publication.user._id}
          >
            {publication.user.nick}
          </Link>
          <p className="text-text-secondary -mt-1 text-sm">
            {publication.user.fullName}
          </p>
        </div>
        {publication.user._id === user._id ? (
          <button
            className="hover:bg-danger text-text-secondary hover:text-text-primary ml-auto shrink-0 rounded-full p-3 hover:cursor-pointer"
            onClick={removePublication}
          >
            <Trash2 />
          </button>
        ) : (
          ""
        )}
      </header>

      <Wrapper {...WrapperProps}>
        <p
          className={`mt-4 px-6 text-2xl wrap-break-word whitespace-pre-wrap ${isFeed ? "line-clamp-5 truncate text-ellipsis" : ""}`}
        >
          {publication.text}
        </p>

        {publication.file && (
          <div className="flex w-full justify-center px-6 py-2 pt-4">
            <img
              src={publication.file}
              className={
                mode === "page"
                  ? "h-full w-full"
                  : "max-h-76 w-full max-w-120 object-contain"
              }
            />
          </div>
        )}
      </Wrapper>

      <footer className="text-text-secondary mx-6 mt-2 mb-4 flex gap-4">
        <Wrapper
          {...WrapperProps}
          className={`flex ${isFeed ? "group cursor-pointer" : ""} items-center gap-1.5`}
        >
          <div>
            <MessageCircle
              className={`${isFeed ? "group-hover:text-primary transition-all group-hover:scale-125" : ""} size-5.5`}
            />
          </div>
          <span className="text-lg">{publication.commentsCount}</span>
        </Wrapper>

        <button
          className="group flex cursor-pointer items-center gap-1.5"
          onClick={toggleLike}
        >
          <div className="group-hover:text-primary transition-all group-hover:scale-125">
            <Heart
              className={`${liked ? "fill-primary text-primary" : ""} size-6`}
            />
          </div>
          <span className="text-lg">{likesCount}</span>
        </button>
        <span className="text-text-secondary justify-self border-border-input border-l pl-3 text-xl">
          {publication.createdAt && (
            <ReactTimeAgo date={publication.createdAt} />
          )}
        </span>
      </footer>
    </article>
  );
};
