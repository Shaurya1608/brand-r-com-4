exports.errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error("Error occurred:", err);
  if (err.stack) console.error(err.stack);

  // Handle Multer file upload errors gracefully
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Uploaded document exceeds maximum allowed size (15MB). Please compress the file and try again.',
        error: 'File size limit exceeded'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error occurred. Please verify your file format and size.',
      error: err.code || 'MulterError'
    });
  }

  // Handle Cloudinary raw/auto file errors
  if (err.http_code || (err.message && err.message.toLowerCase().includes('cloudinary'))) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Cloud upload service error. Please ensure file is under 15MB.',
      error: 'UploadError'
    });
  }

  const statusCode = error.statusCode || (err.status ? err.status : 500);
  const msg = error.message || err.message || 'Server Error';

  res.status(statusCode).json({
    success: false,
    message: msg,
    error: msg
  });
};
