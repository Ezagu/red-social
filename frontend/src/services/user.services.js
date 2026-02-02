import { url } from "../helpers/Global";

export const editUser = async (data) => {
  const request = await fetch(url + "user", {
    method: "PUT",
    body: data,
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
  return await request.json();
};
