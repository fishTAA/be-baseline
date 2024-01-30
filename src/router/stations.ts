import express from "express";
import {
  CheckStationDistance,
  FindbyCoor,
  NewStation,
  UpdateStation,
} from "../controllers/Stations";
import { isAuthenticated } from "../middleware";

export default (router: express.Router) => {
  router.get("/specific/:collection", FindbyCoor);
  router.post("/findstation", FindbyCoor);
  router.post("/newstation", isAuthenticated, NewStation);
  router.post("/updateStations", isAuthenticated, UpdateStation);
  router.post("/checkDistance", isAuthenticated, CheckStationDistance);
};
