export const notFoundMiddleware = (req, res, next) => {
  res
    .status(404)
    .json({ msg: `This Route ${req.url} not found with method ${req.method}` });
};
