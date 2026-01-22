import { url } from "./Global";

const Request = async (
  endpoint,
  method = "GET",
  token = null,
  body = null,
  contentType = "application/json",
) => {
  const stringifyBody = body ? JSON.stringify(body) : null;
  const headers = {
    "Content-Type": contentType,
    Authorization: token,
  };

  const data = await fetch(url + endpoint, {
    method,
    body: stringifyBody,
    headers,
  });
  return await data.json();
};

export default Request;
