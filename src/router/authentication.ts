import express from "express";
import { CheckToken, Login } from "../controllers/Authentication";

export default (router: express.Router) => {
  router.post("/user/login", Login);
  router.post("/check-token", CheckToken);
};
