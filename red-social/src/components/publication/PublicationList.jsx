import React from "react";
import avatar from "../../assets/img/user.png";
import { Link } from "react-router-dom";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";
import ReactTimeAgo from 'react-time-ago';

export const PublicationList = ({publications, setPublications, getPublications, page, setPage, more, setMore}) => {

  const { auth } = useAuth();

  const nextPage = () => {
    const next = page + 1;
    setPage(next);
    getPublications(next)
  }

  const deletePublication = async (publicationId) => {
    const req = await fetch(Global.url + 'publication/remove/'+ publicationId, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      }
    });

    const data = await req.json();

    if(data.status !== 'success') return;

    setPublications(prevPublications => (
      prevPublications.filter(pub => pub._id !== publicationId)
    ))
  }

  return (
    <>
      <div className="content__posts">
        {publications.map((publication) => {
          return (
            <article className="posts__post" key={publication._id}>
              <div className="post__container">
                <div className="post__image-user">
                  <Link
                    to={"/social/perfil/" + publication.user._id}
                    className="post__image-link"
                  >
                    <img
                      src={
                        publication.user.image !== "default.png"
                          ? Global.url + "user/avatar/" + publication.user.image
                          : avatar
                      }
                      className="post__user-image"
                      alt="Foto de perfil"
                    />
                  </Link>
                </div>

                <div className="post__body">
                  <div className="post__user-info">
                    <Link to={"/social/perfil/" + publication.user._id} className="user-info__name">
                      {publication.user.nick}
                    </Link>
                    <span className="user-info__divider"> | </span>
                    <a href="#" className="user-info__create-date">
                      <ReactTimeAgo date={publication.created_at} locale='es-ES'/>
                    </a>
                  </div>

                  <h4 className="post__content">{publication.text}</h4>

                  {publication.file && (
                    <img
                      src={Global.url + "publication/media/" + publication.file}
                    />
                  )}
                </div>
              </div>

              {auth._id === publication.user._id && (
                <div className="post__buttons">
                  <button
                    className="post__button"
                    onClick={() => deletePublication(publication._id)}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {more && (
        <div className="content__container-btn">
          <button className="content__btn-more-post" onClick={nextPage}>
            Ver mas publicaciones
          </button>
        </div>
      )}
    </>
  );
};
