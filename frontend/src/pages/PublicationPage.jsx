import React, { useEffect, useState } from "react";
import { Publication } from "../components/publications/Publication.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Comment } from "../components/comments/Comment.jsx";
import { useParams } from "react-router";
import Request from "../helpers/Request.jsx";
import { Loading } from "../components/ui/Loading.jsx";

export const PublicationPage = () => {
  const { id } = useParams();

  const [publication, setPublication] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPublication = async () => {
      const token = localStorage.getItem("token");
      const response = await Request("publication/" + id, "GET", token);
      setPublication(response.publication);
      setLoading(false);
      console.log(response.publication);
    };

    getPublication();
  }, [id]);

  return (
    <main className="bg-surface text-text-primary rounded-2xl">
      {loading ? (
        <Loading />
      ) : (
        <>
          <Publication mode="page" publication={publication} />
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
        </>
      )}
    </main>
  );
};
