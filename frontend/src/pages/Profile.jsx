import React from "react";
import { Link } from "react-router";
import { Avatar } from "../components/ui/Avatar";
import { SquarePen } from "lucide-react";
import { PageHeader } from "../components/pages/PageHeader.jsx";
import { Publication } from "../components/publications/Publication.jsx";

export const Profile = () => {
  return (
    <main className="text-text-primary bg-surface flex flex-col items-center rounded-2xl">
      <PageHeader title="Perfil de ezagu" />
      <header className="relative w-full p-4">
        <div className="ml-4 flex gap-4">
          {/*<ButtonFollowUnfollow following={true} />*/}
          <button className="bg-primary hover:bg-primary-hover absolute top-3 right-4 flex cursor-pointer items-center gap-2 rounded-2xl px-3 py-1">
            Edit Profile
            <SquarePen className="size-5" />
          </button>
          <Avatar
            src="/src/assets/agus.jpg"
            size="4xl"
            className="border-primary border"
          />
          <div className="flex grow flex-col">
            <div className="mt-2 flex items-center gap-2">
              <h1 className="text-5xl font-semibold">Ezagu</h1>
              <span className="bg-elevated text-md rounded-2xl px-1.5 py-0.5">
                Te sigue
              </span>
            </div>
            <h2 className="text-text-secondary mt-1 text-xl">Agustín Calpe</h2>
            <p className="mt-2 text-xl">Licenciado en informatica</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3">
          <Link className="border-border-input border-r">
            <h3 className="text-text-secondary text-center text-xl">
              Publicaciones
            </h3>
            <p className="text-center text-3xl font-bold">9</p>
          </Link>
          <Link className="border-border-input border-r">
            <h3 className="text-text-secondary text-center text-xl">
              Seguidores
            </h3>
            <p className="text-center text-3xl font-bold">12</p>
          </Link>
          <Link>
            <h3 className="text-text-secondary text-center text-xl">
              Seguidos
            </h3>
            <p className="text-center text-3xl font-bold">18</p>
          </Link>
        </div>
      </header>
      <section className="bg-surface w-full rounded-2xl pt-2">
        <ul className="border-border-input border-t">
          <Publication />
          <Publication />
          <Publication />
          <Publication />
        </ul>
      </section>
      <button className="bg-primary hover:bg-primary-hover text-text-primary m-auto my-4 w-1/2 cursor-pointer rounded-2xl py-2 font-semibold">
        Ver más
      </button>
    </main>
  );
};
