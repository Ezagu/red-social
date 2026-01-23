import React, { useEffect, useState } from "react";
import { Loading } from "../components/ui/Loading";
import Request from "../helpers/Request";
import { ListPublications } from "../components/publications/ListPublications";

export const Home = () => {
  const [section, setSection] = useState("all");
  const [loading, setLoading] = useState(true);
  const [publications, setPublications] = useState([]);
  const [publicationsInfo, setPublicationsInfo] = useState([]);

  useEffect(() => {
    const getPublications = async () => {
      setLoading(true);
      const endpoint =
        section === "all"
          ? "publication/publications?limit=20"
          : "publication/publications/following?limit=20";

      const response = await Request(endpoint);

      setPublicationsInfo(response);
      setPublications(response.publications);
      setLoading(false);
    };

    getPublications();
  }, [section]);

  const loadNextPage = async () => {
    const endpoint =
      section === "all"
        ? `publication/publications?limit=20&page=${Number(publicationsInfo.page) + 1}`
        : `publication/publications/following?limit=20&page=${Number(publicationsInfo.page) + 1}`;

    const response = await Request(endpoint);
    setPublicationsInfo(response);
    setPublications((prev) => [...prev, ...response.publications]);
  };

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
      {loading ? (
        <Loading />
      ) : (
        <ListPublications
          publications={publications}
          setPublications={setPublications}
          publicationsInfo={publicationsInfo}
          loadNextPage={loadNextPage}
        />
      )}
    </main>
  );
};
