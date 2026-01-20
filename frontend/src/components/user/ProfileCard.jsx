import React from "react";
import { Avatar } from "../../components/ui/Avatar.jsx";
import { Link } from "react-router";
import { LogOut } from "lucide-react";

export const ProfileCard = () => {
  return (
    <div className="text-text-primary bg-surface relative rounded-2xl p-4">
      <button className="hover:bg-danger hover:text-text-primary absolute top-5 right-10 cursor-pointer rounded-full p-2 text-gray-500 transition-all">
        <LogOut />
      </button>
      <div className="ml-4 flex items-center gap-4">
        <Link>
          <Avatar
            src="/src/assets/agus.jpg"
            size="2xl"
            className="border-primary border"
          />
        </Link>
        <div className="grow">
          <Link className="text-4xl font-semibold">Ezagu</Link>
          <h2 className="text-text-secondary text-lg font-light">
            Agustín Calpe
          </h2>
          <div className="mt-2 grid grid-cols-3">
            <Link className="border-border-input border-r">
              <h3 className="text-text-muted text-center text-sm">
                Publicaciones
              </h3>
              <p className="text-text-secondary text-center text-xl font-bold">
                9
              </p>
            </Link>
            <Link className="border-border-input border-r">
              <h3 className="text-text-muted text-center text-sm">
                Seguidores
              </h3>
              <p className="text-text-secondary text-center text-xl font-bold">
                12
              </p>
            </Link>
            <Link>
              <h3 className="text-text-muted text-center text-sm">Seguidos</h3>
              <p className="text-text-secondary text-center text-xl font-bold">
                18
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
