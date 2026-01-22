import React from "react";
import { Avatar } from "../../components/ui/Avatar.jsx";
import { Link } from "react-router";
import { MessageCircle } from "lucide-react";
import { Heart } from "lucide-react";
import { PageHeader } from "../pages/PageHeader.jsx";

export const Publication = ({ mode = "feed" }) => {
  {
    /*Cambiar tipo de publicacion para feed o pagina*/
  }
  const isFeed = mode === "feed";

  const Wrapper = isFeed ? Link : "div";
  const WrapperProps = isFeed ? { to: "/publication/a" } : {};

  return (
    <article className="border-border-input mt-4 border-t pt-4 first:border-none first:pt-0 last:border-b">
      {!isFeed && <PageHeader title="Publicación" />}
      <header className="flex items-center gap-2 px-4">
        <Link>
          <Avatar src="/src/assets/agus.jpg" size="lg" />
        </Link>
        <div>
          <Link className="text-xl font-semibold">Ezagu</Link>
          <p className="text-text-secondary -mt-1 text-sm">Agustín Calpe</p>
        </div>
      </header>

      <Wrapper {...WrapperProps}>
        <p className="mt-2 px-6 text-2xl">El funcking liam biblical</p>

        <div className="flex w-full justify-center px-6 py-2 pt-4">
          <img
            src="/src/assets/oasis.jpg"
            alt=""
            className={
              mode === "page"
                ? "h-full w-full"
                : "max-h-76 w-full max-w-120 object-contain"
            }
          />
        </div>
      </Wrapper>

      <footer className="mx-6 mt-2 mb-4 flex gap-4">
        <Wrapper
          {...WrapperProps}
          className="flex cursor-pointer items-center gap-1.5"
        >
          <div>
            <MessageCircle className="size-5.5" />
          </div>
          <span className="text-lg">0</span>
        </Wrapper>

        <button className="flex cursor-pointer items-center gap-1.5">
          <div>
            <Heart className="fill-primary text-primary size-6" />
          </div>
          <span className="text-lg">1</span>
        </button>
        <span className="text-text-secondary justify-self border-l pl-3 text-xl">
          6h
        </span>
      </footer>
    </article>
  );
};
