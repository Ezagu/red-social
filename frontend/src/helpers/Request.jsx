import { url } from "./Global";

const Request = async (
  endpoint,
  method = "GET",
  token = true,
  body = null,
  contentType = "application/json",
) => {
  const stringifyBody = body ? JSON.stringify(body) : null;
  let Authorization = null;
  if (token) Authorization = localStorage.getItem("token");

  const headers = {
    "Content-Type": contentType,
    Authorization,
  };

  const data = await fetch(url + endpoint, {
    method,
    body: stringifyBody,
    headers,
  });
  return await data.json();
};

export default Request;
