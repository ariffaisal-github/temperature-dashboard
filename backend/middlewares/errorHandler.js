export function errorHandler(err, req, res, next) {
  console.error("Global Error:", err);

  res.status(err.statusCode || 500).json({
    statusCode: err.statusCode || 500,
    error: err.message || "Internal Server Error",
  });
}
