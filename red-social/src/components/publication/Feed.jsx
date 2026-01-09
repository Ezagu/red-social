import React, { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import { Link, useParams } from "react-router-dom";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";
import { PublicationList } from "../publication/PublicationList";

export const Feed = () => {
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);

  useEffect(() => {
    getPublications(1, false);
  }, []);

  const getPublications = async (nextPage, showNews = false) => {
    if (showNews) {
      setPublications([]);
      setPage(1);
      nextPage = 1;
    }

    const req = await fetch(Global.url + "publication/feed/" + nextPage, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await req.json();

    if (data.status !== "success") return;

    setPublications((prevPublications) => [
      ...prevPublications,
      ...data.publications,
    ]);

    setMore(data.hasNextPage);
  };

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Timeline</h1>
        <button
          className="content__button"
          onClick={() => getPublications(1, true)}
        >
          Mostrar nuevas
        </button>
      </header>

      <PublicationList
        publications={publications}
        page={page}
        setPage={setPage}
        more={more}
        setMore={setMore}
        setPublications={setPublications}
        getPublications={getPublications}
      />

      <br />
    </>
  );
};
