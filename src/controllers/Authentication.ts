import express from "express";
import { findUser } from "../db";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export const Login = async (req: express.Request, res: express.Response) => {
  console.log("secret", JWT_SECRET);
  const username = req.body.username.replace(/\s/g, "") as string;
  const password = req.body.pass as string;
  const user = await findUser(username);
  if (user && user?.password === password) {
    const token = jwt.sign(
      {
        username: user?.userName,
        firstname: user?.firstName,
        lastname: user?.lastName,
      },
      JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    res.status(200).send({
      jwt: token,
    });
  } else {
    res.status(401).send({
      message: "access denied",
    });
  }
};

export const CheckToken = async (
  req: express.Request,
  res: express.Response
) => {
  const { token } = req.body;

  // Check if the token is present
  if (!token) {
    return res
      .status(400)
      .json({ isValid: false, message: "Token is missing" });
  }

  res.json(CheckTokenfc(token));
};

export const CheckTokenfc = (token: string) => {
  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, JWT_SECRET);
    // console.log("decoded", decoded);
    // If verification is successful, the token is considered valid
    return { isValid: true, message: "Token is valid" };
  } catch (error) {
    // If verification fails, the token is considered invalid or tampered with
    console.log(error, token);
    return {
      isValid: false,
      message: "Token is invalid or tampered with",
    };
  }
};
