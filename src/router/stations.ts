import express from "express";
import {
  CheckStationDistance,
  DeleteStation,
  FindbyCoor,
  NewStation,
  Tapin,
  Tapout,
  UpdateStation,
} from "../controllers/Stations";
import { isAuthenticated, isOperational } from "../middleware";

export default (router: express.Router) => {
  router.get("/specific/:collection", FindbyCoor);
  router.post("/findstation", FindbyCoor);
  router.post("/newstation", isAuthenticated, NewStation);
  router.post("/updateStations", isAuthenticated, UpdateStation);
  router.post("/checkDistance", isAuthenticated, CheckStationDistance);
  router.delete("/deleteStation/:id", isAuthenticated, DeleteStation);
  router.post("/station/tapin",isOperational, Tapin);
  router.post("/station/tapout",isOperational, Tapout);
};
