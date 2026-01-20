import React, { useState } from "react";
import { ListPublications } from "../components/publications/ListPublications";
import { LoaderCircle } from "lucide-react";

export const Home = () => {
  const [section, setSection] = useState("all");
  const [loading, setLoading] = useState(false);

  return (
    <main className="bg-surface rounded-2xl">
      <header className="text-text-primary border-border-input border-b text-center">
        <div className="flex">
          <button
            className={
              section === "all"
                ? "bg-primary w-full cursor-pointer rounded-t-2xl p-2 text-lg font-semibold transition-all"
                : "hover:bg-elevated text-text-secondary text-md w-full cursor-pointer rounded-t-2xl rounded-tr-2xl p-2 text-lg font-normal transition-all"
            }
            onClick={() => setSection("all")}
          >
            Todos
          </button>
          <button
            className={
              section === "following"
                ? "bg-primary w-full cursor-pointer rounded-t-2xl p-2 text-lg font-semibold transition-all"
                : "hover:bg-elevated text-text-secondary text-md w-full cursor-pointer rounded-t-2xl rounded-tr-2xl p-2 text-lg font-normal transition-all"
            }
            onClick={() => setSection("following")}
          >
            Siguiendo
          </button>
        </div>
      </header>
      <section>
        {loading ? (
          <LoaderCircle className="text-primary m-auto mt-10 size-15 animate-spin" />
        ) : (
          <ListPublications />
        )}
      </section>
    </main>
  );
};
