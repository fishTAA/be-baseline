import express from "express";
import { FindbyCoor } from "../controllers/Stations";

export default (router: express.Router) => {
  router.get("/specific/:collection", FindbyCoor);
  router.post("/findstation", FindbyCoor);
};
