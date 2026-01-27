import React from "react";
import { Avatar } from "../../components/ui/Avatar.jsx";
import { Link } from "react-router";
import { MessageCircle } from "lucide-react";
import { Heart } from "lucide-react";
import { PageHeader } from "../pages/PageHeader.jsx";
import { url } from "../../helpers/Global.jsx";
import { useLike } from "../../hooks/useLike.jsx";

export const Publication = ({ mode = "feed", publication }) => {
  {
    /*Cambiar tipo de publicacion para feed o pagina*/
  }
  const isFeed = mode === "feed";

  const Wrapper = isFeed ? Link : "div";
  const WrapperProps = isFeed ? { to: "/publication/" + publication._id } : {};

  const { liked, likesCount, toggleLike } = useLike({
    target: publication,
    targetType: "Publication",
  });

  return (
    <article
      className={`border-border-input border-t ${isFeed ? "pt-4" : ""} first:border-t-0 last:border-b`}
    >
      {!isFeed && <PageHeader title="Publicación" />}
      <header className="flex items-center gap-2 px-4">
        <Link to={"/profile/" + publication.user._id}>
          <Avatar
            src={url + "user/avatar/" + publication.user.image}
            size="lg"
          />
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
      </header>

      <Wrapper {...WrapperProps}>
        <p className="mt-4 px-6 text-2xl wrap-break-word">{publication.text}</p>

        {publication.file && (
          <div className="flex w-full justify-center px-6 py-2 pt-4">
            <img
              src={url + "publication/media/" + publication.file}
              className={
                mode === "page"
                  ? "h-full w-full"
                  : "max-h-76 w-full max-w-120 object-contain"
              }
            />
          </div>
        )}
      </Wrapper>

      <footer className="text-text-secondary mx-6 mt-4 mb-4 flex gap-4">
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
          {publication.createdAt}
        </span>
      </footer>
    </article>
  );
};
