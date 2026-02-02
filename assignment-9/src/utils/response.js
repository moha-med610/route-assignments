export const responseSuccess = (res, code = 200, message = "Success", data) => {
  return res.status(code).json({
    success: true,
    code,
    message,
    data,
  });
};
