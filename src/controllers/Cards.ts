import express from "express";
import { cardgen, findData, getConnection } from "../db";
import { checkcard, deleteCard, updateBalance } from "../dbFunctions/cardDB";
import { getSingleStation } from "../dbFunctions/stationDB";
import { error } from "console";
import { WithId } from "mongodb";
import { station } from "../models";

export const NewCard = async (req: express.Request, res: express.Response) => {
  try {
    const card = req.body.cardnum as number;
    const bal = Math.round(req.body.balance as number);
    if (card === null) {
      return res.status(400);
    }
    const result = await cardgen(card, bal);
    console.log(result);

    if (result === null) {
      return res.status(400);
    } else {
      return res.status(200).json(true);
    }
  } catch (e) {
    console.error(e);
    return res.status(400);
  }
};
export const DeleteCard = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const card = req.body.cardnum;
    console.log("deleting card:", card);
    const document = await deleteCard(Number(card));
    console.log(document);
    if (document) {
      res.status(200).json(true);
    } else {
      res.status(400).json(false);
    }
  } catch (e) {
    console.error(e);
  }
};

export const AddCardBal = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const card = req.body.cardnum;
    const bal = req.body.balance;
    const balance = Math.round(Number(bal));
    console.log(card, bal);
    const document = await updateBalance(Number(card), balance);
    console.log(document);
    if (document) {
      res.status(200).json(true);
    } else {
      res.status(400).json(false);
    }
  } catch (e) {
    console.error(e);
  }
};
export const CheckCard = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const cardnum = req.query.cardnum as string;
    const card = +cardnum;
    const document = await checkcard(card);
    console.log(document);
    if (document) {
      res.json(true);
    } else {
      res.json(false);
    }
  } catch (e) {
    console.error(e);
  }
};
export const CardCollection = async (
  req: express.Request,
  res: express.Response
) => {
  const collection = req.params.collection;
  const documnetName = req.query.title;
  if (!documnetName) {
    return res.status(400).json({ error: "Station parameter is required." });
  }
  const carNum = Number(documnetName);
  const document = await findData(collection, carNum);
  if (document) {
    res.json(document);
  } else {
    res.status(404).json({ error: "Card not found." });
  }
};
export const CheckCardState = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const db = await getConnection();
    const collection = db.collection("CardsAcc");
    const cardsWithState = await collection
      .find({ state: { $ne: null } })
      .toArray();
    if (cardsWithState.length === 0) {
      res.status(404).json([]);
    } else {
      res.json(cardsWithState);
    }
  } catch (error) {
    console.error("Error finding cards:", error);
    res.status(500).send("Internal Server Error");
  }
};
