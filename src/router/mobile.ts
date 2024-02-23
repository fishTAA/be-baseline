import express from "express";
import {
  CreateNewDevice,
  FindCard,
  FindTransaction,
  InsertNewCard,
  getMobileRecord,
} from "../controllers/Mobile";

export default (router: express.Router) => {
  router.post("/newdevice", CreateNewDevice);
  router.post("/insertcard/:id", InsertNewCard);
  router.get("/mobileusers/:id", getMobileRecord);
  router.get("/getCard/:id", FindCard);
  router.get("/gettrasaction/:id", FindTransaction);
};
