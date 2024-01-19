import express from "express";
import { GetSetting, UpdateFare } from "../controllers/Settings";
import { isAuthenticated } from "../middleware";

export default (router: express.Router) => {
  router.get("/settings", isAuthenticated, GetSetting);
  router.post("/updateSettingfare", isAuthenticated, UpdateFare);
};
