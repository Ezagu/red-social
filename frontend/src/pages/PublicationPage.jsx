import React, { useEffect, useState } from "react";
import { Publication } from "../components/publications/Publication.jsx";
import { Comment } from "../components/comments/Comment.jsx";
import { useNavigate, useParams } from "react-router";
import Request from "../helpers/Request.jsx";
import { Loading } from "../components/ui/Loading.jsx";

export const PublicationPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [publication, setPublication] = useState({});
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);

  const createComment = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;

    const response = await Request(`comment`, "POST", true, {
      publicationId: id,
      text,
    });

    if (response.status === "error") {
      return;
    }

    setPublication((prev) => ({
      ...prev,
      commentsCount: prev.commentsCount + 1,
    }));
    setComments((prev) => [response.comment, ...prev]);
    e.target.text.value = "";
  };

  useEffect(() => {
    const getPublication = async () => {
      const response = await Request("publication/" + id, "GET");

      if (response.status === "error") {
        navigate("/error");
      }

      setPublication(response.publication);
      setLoading(false);

      //Buscar comentarios
      const responseComments = await Request(`publication/${id}/comments`);
      setLoadingComments(false);
      setComments(responseComments.comments);
    };

    getPublication();
  }, [id, navigate]);

  return (
    <main className="bg-surface text-text-primary rounded-2xl">
      {loading ? (
        <Loading />
      ) : (
        <>
          <Publication mode="page" publication={publication} />
          <section>
            <form
              className="border-border-input m-4 mb-0 flex gap-2 border-b pt-0 pb-4"
              onSubmit={createComment}
            >
              <input
                type="text"
                className="border-border-input placeholder:text-placeholder focus:border-primary text-text-primary w-full rounded-xl border p-3 text-lg focus:outline-none"
                placeholder="Ingrese un comentario"
                required
                name="text"
              />
              <input
                type="submit"
                className="bg-primary cursor-pointer rounded-2xl px-4 text-lg font-semibold"
                value="Comentar"
              />
            </form>
            <ul className="px-4">
              {loadingComments ? (
                <Loading />
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <Comment comment={comment} key={comment._id} />
                ))
              ) : (
                <div>
                  <p className="my-6 text-center text-xl">No hay comentarios</p>
                </div>
              )}
            </ul>
          </section>
        </>
      )}
    </main>
  );
};
