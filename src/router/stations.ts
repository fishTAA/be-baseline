import express from "express";
import { FindbyCoor, NewStation } from "../controllers/Stations";
import { isAuthenticated } from "../middleware";

export default (router: express.Router) => {
  router.get("/specific/:collection", FindbyCoor);
  router.post("/findstation", FindbyCoor);
  router.post("/newstation", isAuthenticated,NewStation);

  
};
