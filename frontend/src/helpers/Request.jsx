import { url } from "./Global";

const Request = async (
  endpoint,
  method = "GET",
  body = null,
  headers = null,
) => {
  const stringifyBody = body ? JSON.stringify(body) : null;

  const data = await fetch(url + endpoint, {
    method,
    body: stringifyBody,
    headers,
  });
  return await data.json();
};

export default Request;
