export const getCookieValue = (req, name) => {
  if (req.cookies?.[name]) return req.cookies[name];

  const cookieHeader = req.headers.cookie || "";
  return cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`))
    ?.split("=")[1];
};

export const getAccessTokenFromRequest = (req) => getCookieValue(req, "token");
