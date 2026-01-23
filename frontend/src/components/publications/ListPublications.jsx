import React from "react";
import { Publication } from "./Publication.jsx";

export const ListPublications = ({
  publicationsInfo,
  publications,
  loadNextPage,
}) => {
  return (
    <>
      <section className="bg-surface text-text-primary w-full rounded-2xl pt-2">
        <ul className="">
          {publications.map((publication) => (
            <Publication
              mode="feed"
              publication={publication}
              key={publication._id}
            />
          ))}
        </ul>
        <footer className="text-center">
          {publicationsInfo.hasNextPage ? (
            <button
              className="bg-primary hover:bg-primary-hover text-text-primary m-auto my-4 w-1/2 cursor-pointer rounded-2xl py-2 font-semibold"
              onClick={loadNextPage}
            >
              Ver más
            </button>
          ) : (
            <p className="text-text-secondary mb-4 text-4xl tracking-widest">
              ...
            </p>
          )}
        </footer>
      </section>
    </>
  );
};
