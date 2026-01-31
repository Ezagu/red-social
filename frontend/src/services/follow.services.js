import Request from "../helpers/Request";

export const followUser = async (id) => {
  const response = await Request(`follow/${id}`, "POST");

  if (response === "error") {
    throw new Error("Error al seguir al usuario");
  }

  return response;
};

export const unfollowUser = async (id) => {
  const response = await Request(`follow/${id}`, "DELETE");

  if (response.status === "error") {
    throw new Error("Error al dejar de seguir usuario");
  }

  return response;
};
