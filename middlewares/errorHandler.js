// const errorHandler = (err, req, res, next) => {
//   console.error("Some error:", err.message);

//   const statusCode = err.statusCode || 400;

//   res.status(statusCode).json({
//     error: err.message || "Something went wrong",
//   });
// };

// const errorHandler = (err, req, res, next) => {
//   console.error("🔥 Error caught by middleware:", err);
//   console.error("🔥 Error type:", typeof err);

//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Internal Server Error";

//   res.status(statusCode).json({
//     error: message,
//     statusCode,
//   });
// };

const errorHandler = (err, req, res, next) => {
  console.error("🔥 Backend error:", err.message);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || "Something went wrong",
  });
};


module.exports = errorHandler;
