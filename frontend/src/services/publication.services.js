import { url } from "../helpers/Global";

export const savePublication = async (data) => {
  const req = await fetch(url + "publication", {
    method: "POST",
    body: data,
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
  return await req.json();
};
