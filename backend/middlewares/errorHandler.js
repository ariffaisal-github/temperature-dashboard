export function errorHandler(err, req, res, next) {
  console.error("Global Error:", err);

  res.status(err.statusCode || 500).json({
    error: err.message || "Internal Server Error",
  });
}
