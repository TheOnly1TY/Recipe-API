
import AppError from "../libs/appError.js";
import dotenv from "dotenv";

dotenv.config();

const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Something went very wrong!"
  });
};

const handleInvalidToken = () =>
  new AppError("Invalid token! Please log in again", 401);

const handleExpiredToken = () =>
  new AppError("Your token has expired! Please log in again", 401);

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err, res);
  }

  let error = err;

  if (error.name === "JsonWebTokenError") {
    error = handleInvalidToken();
  }

  if (error.name === "TokenExpiredError") {
    error = handleExpiredToken();
  }

  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  return sendErrorProd(error, res);
};
