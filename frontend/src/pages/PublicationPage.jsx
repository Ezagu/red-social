import React, { useEffect, useState } from "react";
import { Publication } from "../components/publications/Publication.jsx";
import { Comment } from "../components/comments/Comment.jsx";
import { useNavigate, useParams } from "react-router";
import Request from "../helpers/Request.jsx";
import { Loading } from "../components/ui/Loading.jsx";
import { usePaginate } from "../hooks/usePaginate.jsx";
import { PageHeader } from "../components/pages/PageHeader.jsx";
import { PageWithHeader } from "../components/pages/PageWithHeader.jsx";

export const PublicationPage = () => {
  const { id } = useParams();

  const [publication, setPublication] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const {
    items: comments,
    paginate,
    loading: loadingComments,
    loadNextPage,
    removeItem,
    addItem,
  } = usePaginate({
    endpoint: `publication/${id}/comments`,
    limit: 10,
  });

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

    addItem(response.comment);

    setPublication((prev) => ({
      ...prev,
      commentsCount: prev.commentsCount + 1,
    }));

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
    };

    getPublication();
  }, [id, navigate]);

  return (
    <PageWithHeader title={"Publicación"}>
      {loading ? (
        <Loading className="my-10" />
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
                <Loading className="my-5" />
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <Comment
                    comment={comment}
                    key={comment._id}
                    remove={() => {
                      removeItem(comment._id);
                      setPublication((prev) => ({
                        ...prev,
                        commentsCount: prev.commentsCount - 1,
                      }));
                    }}
                  />
                ))
              ) : (
                <div>
                  <p className="text-text-secondary my-6 text-center text-xl tracking-wide">
                    No hay comentarios
                  </p>
                </div>
              )}
            </ul>
            {paginate.hasNextPage && (
              <div className="border-border-input mx-4 border-t text-center">
                <button
                  onClick={loadNextPage}
                  className="bg-primary hover:bg-primary-hover text-text-primary my-4 w-1/2 cursor-pointer self-center rounded-2xl py-2 font-semibold"
                >
                  Ver más
                </button>
              </div>
            )}
          </section>
        </>
      )}
    </PageWithHeader>
  );
};
