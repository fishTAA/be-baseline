import express from "express";
import {
  AddCardBal,
  CardCollection,
  CheckCard,
  CheckCardState,
  DeleteCard,
  NewCard,
} from "../controllers/Cards";
import { isAuthenticated } from "../middleware";

export default (router: express.Router) => {
  router.post("/newCard", isAuthenticated, NewCard);
  router.get("/checkcardnum", isAuthenticated, CheckCard);
  router.post("/addbal", isAuthenticated, AddCardBal);
  router.get("/specific/:collection", CardCollection);
  router.delete("/deletecard", isAuthenticated, DeleteCard);
  router.get("/checkstate", isAuthenticated, CheckCardState);
};
