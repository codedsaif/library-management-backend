const sendErrorDevelopment = (err, req, res) => {
  if (req.originalUrl.startsWith("https://localhost:")) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
  console.log("ERROR", err);
  return res
    .status(err.statusCode)
    .json({ title: "Something went wrong!", message: err.message });
};

export default function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = error.status || "error";
  console.log("ERROR IN ERROR_CONTROLLER", err.statusCode, err.status);
  sendErrorDevelopment(err, req, res);
}
