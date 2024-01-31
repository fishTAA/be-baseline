import jwt from "jsonwebtoken";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authorizationHeader = req.header("Authorization");
  console.log("token", authorizationHeader);
  if (!authorizationHeader) {
    return res
      .status(401)
      .json({ message: "Unauthorized - Bearer token not provided" });
  }

  const [bearer, token] = authorizationHeader.split(" ");

  if (bearer !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid Bearer token format" });
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - Token not provided" });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, JWT_SECRET);
    // console.log("decoded", decoded);

    // If verification is successful, the token is considered valid
    next();
  } catch (error) {
    // If verification fails, the token is considered invalid or tampered with
    console.log(error, token);
    return res.status(401).json({
      message: "Unauthorized - Token is invalid or tampered with",
    });
  }
};
