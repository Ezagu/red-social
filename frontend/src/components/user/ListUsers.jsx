import React from "react";
import { Avatar } from "../ui/Avatar";
import { Link } from "react-router";
import { ButtonFollowUnfollow } from "../ui/ButtonFollowUnfollow";

export const ListUsers = () => {
  return (
    <section className="flex flex-col items-center gap-4">
      <Link className="bg-surface relative flex w-full items-center gap-3 rounded-2xl px-4 py-2">
        <Avatar src="/src/assets/kiara.jpg" size="lg" />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold">dkiara03</span>
            <span className="bg-elevated rounded-2xl px-1.5 py-0.5 text-sm">
              Te sigue
            </span>
          </div>
          <p className="text-text-muted -mt-1">Kiara Duarte</p>
          <p>Tengo al mejor novio del mundoooo</p>
        </div>
        <ButtonFollowUnfollow following={false} />
      </Link>

      <Link className="bg-surface relative flex w-full items-center gap-3 rounded-2xl px-4 py-2">
        <Avatar src="/src/assets/liam.jpg" size="lg" />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold">liambiblical</span>
          </div>
          <p className="text-text-muted -mt-1">William Gallagher</p>
          <p>Im the fucking number one</p>
        </div>
        <ButtonFollowUnfollow following={true} />
      </Link>

      <button className="bg-primary hover:bg-primary-hover w-1/2 cursor-pointer rounded-2xl py-2 font-semibold">
        Ver más
      </button>
    </section>
  );
};
