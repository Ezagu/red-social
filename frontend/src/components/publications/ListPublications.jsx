import React from "react";
import { Publication } from "./Publication.jsx";

export const ListPublications = ({
  paginate,
  publications,
  loadNextPage,
  removeItem,
}) => {
  return (
    <>
      <section className="bg-surface text-text-primary w-full rounded-2xl pt-2">
        {console.log(publications)}
        <ul className="">
          {publications.map((publication) => (
            <Publication
              mode="feed"
              publication={publication}
              key={publication._id}
              removeItem={removeItem}
            />
          ))}
        </ul>
        <footer
          className={`text-center ${paginate.hasNextPage && "border-border-input border-t"}`}
        >
          {publications.length === 0 ? (
            <p className="text-text-secondary my-10 text-xl tracking-wide">
              No hay publicaciones
            </p>
          ) : (
            paginate.hasNextPage && (
              <button
                className="bg-primary hover:bg-primary-hover text-text-primary m-auto my-4 w-1/2 cursor-pointer rounded-2xl py-2 font-semibold"
                onClick={loadNextPage}
              >
                Ver más
              </button>
            )
          )}
        </footer>
      </section>
    </>
  );
};
