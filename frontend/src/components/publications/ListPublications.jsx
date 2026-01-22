import React from "react";
import { Avatar } from "../../components/ui/Avatar.jsx";
import { Link } from "react-router";
import { MessageCircle } from "lucide-react";
import { Heart } from "lucide-react";
import { Publication } from "./Publication.jsx";

export const ListPublications = () => {
  return (
    <ul className="text-text-primary">
      <Publication />

      <article className="border-border-input border-t pt-4 first:border-none">
        <header className="flex items-center gap-2 px-4">
          <Link>
            <Avatar src="/src/assets/agus.jpg" size="md" />
          </Link>
          <div>
            <Link className="text-xl font-semibold">Ezagu</Link>
            <p className="text-text-secondary -mt-1 text-sm">Agustín Calpe</p>
          </div>
        </header>

        <Link>
          <p className="mt-2 px-6 text-xl">Publicacion sin ninguna imagen</p>
        </Link>

        <footer className="mt-2 flex gap-4 px-6 pb-4">
          <Link className="flex cursor-pointer items-center gap-1.5">
            <div>
              <MessageCircle className="size-5.5" />
            </div>
            <span className="text-lg">0</span>
          </Link>

          <button className="flex cursor-pointer items-center gap-1.5">
            <div>
              <Heart className="fill-primary text-primary size-6" />
            </div>
            <span className="text-lg">1</span>
          </button>
          <span className="text-text-secondary border-l pl-3 text-xl">12h</span>
        </footer>
      </article>

      <article className="border-border-input border-t pt-4 first:border-none">
        <header className="flex items-center gap-2 px-4">
          <Link>
            <Avatar src="/src/assets/agus.jpg" size="md" />
          </Link>
          <div>
            <Link className="text-xl font-semibold">Ezagu</Link>
            <p className="text-text-secondary -mt-1 text-sm">Agustín Calpe</p>
          </div>
        </header>

        <Link>
          <p className="mt-2 px-6 text-xl">Los mejores</p>

          <div className="flex w-full justify-center px-6 py-2 pt-4">
            <img
              src="/src/assets/oasis.jpg"
              alt=""
              className="max-h-76 w-full max-w-120 object-contain"
            />
          </div>
        </Link>

        <footer className="mt-2 flex gap-4 px-6 pb-4">
          <Link className="flex cursor-pointer items-center gap-1.5">
            <div>
              <MessageCircle className="size-5.5" />
            </div>
            <span className="text-lg">0</span>
          </Link>

          <button className="flex cursor-pointer items-center gap-1.5">
            <div>
              <Heart className="fill-primary text-primary size-6" />
            </div>
            <span className="text-lg">1</span>
          </button>
          <span className="text-text-secondary border-l pl-3 text-xl">2d</span>
        </footer>
      </article>
    </ul>
  );
};
