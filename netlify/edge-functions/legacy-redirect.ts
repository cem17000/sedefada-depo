export default (request: Request) => {
  const homepage = new URL("/", request.url);

  return Response.redirect(homepage, 301);
};
