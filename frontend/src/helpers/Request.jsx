import { url } from "./Global";

const Request = async (
  endpoint,
  method = "GET",
  token = true,
  body = null,
  contentType = "application/json",
  bodyStringify = true,
) => {
  const finalBody = body ? (bodyStringify ? JSON.stringify(body) : body) : null;
  let Authorization = null;
  if (token) Authorization = localStorage.getItem("token");

  const headers = {
    "Content-Type": contentType,
    Authorization,
  };

  const data = await fetch(url + endpoint, {
    method,
    body: finalBody,
    headers,
  });
  return await data.json();
};

export default Request;
