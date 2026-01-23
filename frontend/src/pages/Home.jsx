import React, { useEffect, useState } from "react";
import { Loading } from "../components/ui/Loading";
import { Publication } from "../components/publications/Publication";
import Request from "../helpers/Request";
import { ListPublications } from "../components/publications/ListPublications";

export const Home = () => {
  const [section, setSection] = useState("all");
  const [loading, setLoading] = useState(true);
  const [publications, setPublications] = useState([]);
  const [publicationsInfo, setPublicationsInfo] = useState([]);
  const [page, setPage] = useState(1);

  const changeSection = (newSection) => {
    if (newSection === section) return;

    setPublications([]);
    setPublicationsInfo([]);
    setPage(1);
    setSection(newSection);
  };

  useEffect(() => {
    const getPublications = async () => {
      const endpoint =
        section === "all"
          ? "publication/publications?limit=20&page=" + page
          : "publication/publications/following?limit=20&page=" + page;

      const response = await Request(endpoint, "GET");

      setPublicationsInfo(response);
      setPublications((prev) =>
        page === 1
          ? response.publications
          : [...prev, ...response.publications],
      );
      setLoading(false);
    };

    getPublications();
  }, [page, section]);

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
            onClick={() => changeSection("all")}
          >
            Todos
          </button>
          <button
            className={
              section === "following"
                ? "bg-primary w-full cursor-pointer rounded-t-2xl p-2 text-lg font-semibold transition-all"
                : "hover:bg-elevated text-text-secondary text-md w-full cursor-pointer rounded-t-2xl rounded-tr-2xl p-2 text-lg font-normal transition-all"
            }
            onClick={() => changeSection("following")}
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
          setPage={setPage}
        />
      )}
    </main>
  );
};
