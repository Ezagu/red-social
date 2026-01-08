import React from "react";
import avatar from "../../assets/img/user.png";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";

export const UserList = ({ users, following, setFollowing, more, page, setPage, loading }) => {
  const { auth } = useAuth();

  const nextPage = () => {
    setPage((p) => p + 1);
  };

  const follow = async (userId) => {
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
      setFollowing((prev) => [...prev, userId]);
    }
  };

  const unfollow = async (userId) => {
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
      const filterFollowings = following.filter(
        (followingUserId) => userId !== followingUserId
      );
      setFollowing(filterFollowings);
    }
  };

  return (
    <>
      <div className="content__posts">
        {users.map((user) => {
          return (
            <article className="posts__post" key={user._id}>
              <div className="post__container">
                <div className="post__image-user">
                  <a href="#" className="post__image-link">
                    <img
                      src={
                        user.image !== "default.png"
                          ? Global.url + "user/avatar/" + user.image
                          : avatar
                      }
                      className="post__user-image"
                      alt="Foto de perfil"
                    />
                  </a>
                </div>

                <div className="post__body">
                  <div className="post__user-info">
                    <a href="#" className="user-info__name">
                      {user.name} {user.surname}
                    </a>
                    <span className="user-info__divider"> | </span>
                    <a href="#" className="user-info__create-date">
                      {user.create_at}
                    </a>
                  </div>

                  <h4 className="post__content">{user.bio}</h4>
                </div>
              </div>
              {/*Solo mostrar botones cuando el usuario no es con el que estoy indentificado*/}
              {user._id !== auth._id && (
                <div className="post__buttons">
                  {following.includes(user._id) ? (
                    <button
                      className="post__button post__button"
                      onClick={() => unfollow(user._id)}
                    >
                      Dejar de seguir
                    </button>
                  ) : (
                    <button
                      className="post__button post__button--green"
                      onClick={() => follow(user._id)}
                    >
                      Seguir
                    </button>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {loading && <div>Cargando...</div>}

      {more && (
        <div className="content__container-btn" onClick={nextPage}>
          <button className="content__btn-more-post">Ver mas personas</button>
        </div>
      )}
    </>
  );
};
