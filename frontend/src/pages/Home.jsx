import React, { useState } from "react";
import { Loading } from "../components/ui/Loading";
import Request from "../helpers/Request";
import { ListPublications } from "../components/publications/ListPublications";
import { usePaginate } from "../hooks/usePaginate";

export const Home = () => {
  const [section, setSection] = useState("all");

  const {
    items: publications,
    paginate,
    loading,
    loadNextPage,
  } = usePaginate({
    endpoint: `${section === "all" ? "publication/publications" : "publication/publications/following"}`,
    limit: 20,
  });

  return (
    <main className="bg-surface text-text-primary rounded-2xl">
      <header className="border-border-input border-b text-center">
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
        <Loading className="my-10" />
      ) : (
        <ListPublications
          publications={publications}
          paginate={paginate}
          loadNextPage={loadNextPage}
        />
      )}
    </main>
  );
};
