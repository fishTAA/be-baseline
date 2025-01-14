import express from "express";
import cards from "./cards";
import authentication from "./authentication";
import stations from "./stations";
import setting from "./setting";
import general from "./general";
import mobile from "./mobile";
const router = express.Router();
export default (): express.Router => {
  cards(router);
  authentication(router);
  stations(router);
  setting(router);
  general(router);
  mobile(router)
  return router;
};
