exports.errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error("Error occurred:", err);
  if (err.stack) console.error(err.stack);

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || err.message || 'Server Error'
  });
};
