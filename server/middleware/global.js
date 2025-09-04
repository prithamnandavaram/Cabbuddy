import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";

export const setupGlobalMiddleware = (app) => {
  app.use(cors({
    origin: [process.env.ORIGIN, "http://localhost:5173"],
    credentials: true,
  }));
  app.use(cookieParser());
  app.use(express.json());
};

export const errorHandler = (err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";
  return res.status(errorStatus).json({
    success: false,
    status: err.status,
    error: errorMessage
  });
};
