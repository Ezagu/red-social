import React from "react";
import { Publication } from "../components/publications/Publication.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Comment } from "../components/comments/Comment.jsx";

export const PublicationPage = () => {
  return (
    <main className="bg-surface text-text-primary rounded-2xl">
      <Publication mode="page" />
      <section>
        <header className="flex gap-2 p-4 pt-0">
          <Input placeholder="Ingrese un comentario" />
          <input
            type="submit"
            className="bg-primary rounded-2xl px-4 text-lg font-semibold"
            value="Comentar"
          />
        </header>
        <ul className="px-4">
          <Comment />
          <Comment />
          <Comment />
        </ul>
      </section>
    </main>
  );
};
