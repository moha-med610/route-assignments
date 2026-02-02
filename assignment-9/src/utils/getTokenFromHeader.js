export const getTokenFromHeader = (authHeader) => {
  return authHeader.split(" ")[1];
};
