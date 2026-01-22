import React, { useEffect, useState } from "react";
import { Loading } from "../components/ui/Loading";
import { Publication } from "../components/publications/Publication";
import Request from "../helpers/Request";

export const Home = () => {
  const [section, setSection] = useState("all");
  const [loading, setLoading] = useState(true);
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    const getPublications = async () => {
      const token = localStorage.getItem("token");
      const endpoint =
        section === "all"
          ? "publication/publications?limit=30"
          : "publication/publications/following?limit=10";
      const response = await Request(endpoint, "GET", token);
      setPublications(response.publications);
      setLoading(false);
    };

    getPublications();
  }, [section]);

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
      <section className="text-text-primary">
        {loading ? (
          <Loading />
        ) : (
          publications.map((publication) => (
            <Publication publication={publication} key={publication._id} />
          ))
        )}
      </section>
    </main>
  );
};
