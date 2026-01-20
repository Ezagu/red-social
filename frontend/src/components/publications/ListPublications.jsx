import React from "react";
import { Avatar } from "../../components/ui/Avatar.jsx";
import { Link } from "react-router";
import { MessageCircle } from "lucide-react";
import { Heart } from "lucide-react";

export const ListPublications = () => {
  return (
    <ul className="text-text-primary">
      <article className="mt-4">
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
          <p className="mt-2 px-6 text-xl">
            El monumental hermoso como siempre
          </p>

          <div className="flex w-full justify-center px-6 py-2 pt-4">
            <img
              src="/src/assets/monu.jpg"
              alt=""
              className="max-h-76 w-full max-w-120 object-contain"
            />
          </div>
        </Link>

        <footer className="border-border-input mt-2 flex gap-4 border-b px-6 pb-4">
          <Link className="flex cursor-pointer items-center gap-1.5">
            <div>
              <MessageCircle className="size-4.5" />
            </div>
            <span>0</span>
          </Link>

          <button className="flex cursor-pointer items-center gap-1.5">
            <div>
              <Heart className="size-5" />
            </div>
            <span>0</span>
          </button>

          <button className="flex cursor-pointer items-center gap-1.5">
            <div>
              <Heart className="bg-primary size-7 rounded-full p-1" />
            </div>
            <span>0</span>
          </button>
        </footer>
      </article>

      <article className="mt-4">
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
          <p className="mt-2 px-6 text-xl">El funcking liam biblical</p>

          <div className="flex w-full justify-center px-6 py-2 pt-4">
            <img
              src="/src/assets/liam.jpg"
              alt=""
              className="max-h-76 w-full max-w-120 object-contain"
            />
          </div>
        </Link>

        <footer className="border-border-input mt-2 flex gap-4 border-b px-6 pb-4">
          <Link className="flex cursor-pointer items-center gap-1.5">
            <div>
              <MessageCircle className="size-4.5" />
            </div>
            <span>0</span>
          </Link>

          <button className="flex cursor-pointer items-center gap-1.5">
            <div>
              <Heart className="size-5" />
            </div>
            <span>0</span>
          </button>

          <button className="flex cursor-pointer items-center gap-1.5">
            <div>
              <Heart className="bg-primary size-7 rounded-full p-1" />
            </div>
            <span>0</span>
          </button>
        </footer>
      </article>

      <article className="mt-4">
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

        <footer className="border-border-input mt-2 flex gap-4 border-b px-6 pb-4">
          <Link className="flex cursor-pointer items-center gap-1.5">
            <div>
              <MessageCircle className="size-4.5" />
            </div>
            <span>0</span>
          </Link>

          <button className="flex cursor-pointer items-center gap-1.5">
            <div>
              <Heart className="size-5" />
            </div>
            <span>0</span>
          </button>

          <button className="flex cursor-pointer items-center gap-1.5">
            <div>
              <Heart className="bg-primary size-7 rounded-full p-1" />
            </div>
            <span>0</span>
          </button>
        </footer>
      </article>

      <article className="mt-4">
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

        <footer className="border-border-input mt-2 flex gap-4 border-b px-6 pb-4">
          <Link className="flex cursor-pointer items-center gap-1.5">
            <div>
              <MessageCircle className="size-4.5" />
            </div>
            <span>0</span>
          </Link>

          <button className="flex cursor-pointer items-center gap-1.5">
            <div>
              <Heart className="size-5" />
            </div>
            <span>0</span>
          </button>

          <button className="flex cursor-pointer items-center gap-1.5">
            <div>
              <Heart className="bg-primary size-7 rounded-full p-1" />
            </div>
            <span>0</span>
          </button>
        </footer>
      </article>
    </ul>
  );
};
