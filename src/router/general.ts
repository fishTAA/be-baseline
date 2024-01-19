import express from "express";
import { GetCollection } from "../controllers/General";
export default (router: express.Router) => {
  router.get("/collection/get", GetCollection);
};
