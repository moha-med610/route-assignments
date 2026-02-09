export const errorHandlingMiddleware = (err, req, res, next) => {
  res.status(err.code || 500).json({
    success: err.success || false,
    code: err.code || 500,
    message: err.message || "Internal Server Error",
  });
};
