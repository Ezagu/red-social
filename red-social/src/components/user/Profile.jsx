import React, { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import GetProfile from "../../helpers/GetProfile";
import { Link, useParams } from "react-router-dom";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";
import { PublicationList } from "../publication/PublicationList";

export const Profile = () => {
  const [user, setUser] = useState({});
  const [counters, setCounters] = useState({});
  const [iFollow, setIFollow] = useState(false);
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);

  const { auth } = useAuth();
  const { userId } = useParams();

  useEffect(() => {
    getDataUser();
    getCounters();
    getPublications(1, true);
  }, [])

  useEffect(() => {
    setPublications([]);
    setPage(1);
    setMore(true);
    setIFollow(false);
    
    getDataUser();
    getCounters();
    getPublications(1, true);
  }, [userId])

  const getDataUser = async () => {
    const dataUser = await GetProfile(userId, setUser);
    if (dataUser.following && dataUser.following._id) setIFollow(true);
  };

  const getCounters = async () => {
    const req = await fetch(Global.url + "user/counters/" + userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await req.json();

    if (data.status !== "success") {
      return;
    }

    setCounters(data);
  };

  const follow = async () => {
    // Peticion al backend para guardar el follow
    const req = await fetch(Global.url + "follow/save", {
      method: "POST",
      body: JSON.stringify({ followed: userId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await req.json();

    // Actualizar estado de following, agregando el nuevo follow
    if (data.status === "success") {
      setIFollow(true);
    }
  };

  const unfollow = async () => {
    // Peticion al backend para borrar el follow
    const req = await fetch(Global.url + "follow/unfollow/" + userId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await req.json();

    // Actualizar estado de following, filtrando los datos para eliminar el antiguo follow
    if (data.status === "success") {
      setIFollow(false);
    }
  };

  const getPublications = async (nextPage, newProfile = false) => {
    const req = await fetch(
      Global.url + "publication/user/" + userId + "/" + nextPage,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    const data = await req.json();

    if (data.status !== "success") return;

    console.log(data);

    if(newProfile) {
      setPublications(data.publications);
    } else {
      setPublications(prevPublications => [...prevPublications, ...data.publications]);
    }
    setMore(data.hasNextPage);
  };

  return (
    <>
      <div className="aside__profile-info">
        <div className="profile-info__general-info">
          <div className="general-info__container-avatar">
            <img
              src={
                user.image !== "default.png"
                  ? Global.url + "user/avatar/" + user.image
                  : avatar
              }
              className="container-avatar__img"
              alt="Foto de perfil"
            />
          </div>
          <div className="general-info__container-names">
            <div href="#" className="container-names__name">
              <h1>
                {user.name} {user.surname}
              </h1>
              {user._id !== auth._id &&
                (iFollow ? (
                  <button
                    className="content__button content__button--rigth post__button"
                    onClick={unfollow}
                  >
                    Dejar de seguir
                  </button>
                ) : (
                  <button
                    className="content__button content__button--rigth"
                    onClick={follow}
                  >
                    Seguir
                  </button>
                ))}
            </div>
            <h2 className="container-names__nickname">{user.nick}</h2>
            <p>{user.bio}</p>
          </div>
        </div>
        <div className="profile-info__stats">
          <div className="stats__following">
            <Link
              to={"/social/siguiendo/" + userId}
              href="#"
              className="following__link"
            >
              <span className="following__title">Siguiendo</span>
              <span className="following__number">{counters.following}</span>
            </Link>
          </div>
          <div className="stats__following">
            <Link
              to={"/social/seguidores/" + userId}
              className="following__link"
            >
              <span className="following__title">Seguidores</span>
              <span className="following__number">{counters.followed}</span>
            </Link>
          </div>
          <div className="stats__following">
            <Link to={"/social/perfil/" + userId} className="following__link">
              <span className="following__title">Publicaciones</span>
              <span className="following__number">{counters.publications}</span>
            </Link>
          </div>
        </div>
      </div>

      <PublicationList 
        publications={publications}
        page={page}
        setPage={setPage}
        more={more}
        setMore={setMore}
        setPublications={setPublications}
      />
      
      <br/>
    </>
  );
};
