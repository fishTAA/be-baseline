import express from "express";
import { CreateNewDevice } from "../controllers/Mobile";

export default (router: express.Router) => {
    router.post("/newdevice", CreateNewDevice);
  };
  