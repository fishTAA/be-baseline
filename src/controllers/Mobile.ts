import express from "express";
import { InsertCard, NewDevice } from "../dbFunctions/mobileDB";
import { getConnection } from "../db";
import { ObjectId } from "mongodb";

export const CreateNewDevice = async (
  req: express.Request,
  res: express.Response
) => {
  const uniqID = req.body.ID;
  console.log("creating new device with id", uniqID);
  if (!uniqID) {
    return res.status(400).json({ error: "No id Detected" });
  }
  try {
    const ret = await NewDevice(uniqID);
    if (ret) {
      return res.status(200).json({ ret });
    }
  } catch (e) {
    console.error(e);
    return res.status(400).json({ e });
  }
};
export const InsertNewCard = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const id = req.params.id;
    const newCard = req.body.newCard;
    console.log("inserting card", newCard, "to", id);
    if (!newCard || !newCard) {
      return res.status(400).json({ message: "Card name is required" });
    }
    const ret = await InsertCard(id, newCard);
    console.log("ret", ret);
    if (ret.state) {
      return res.status(200).json({ ret });
    }
    return res.status(400).json({ ret });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ state: false, mess: e });
  }
};
export const getMobileRecord = async (
  req: express.Request,
  res: express.Response
) => {
  const objectId = req.params.id;
  console.log("getting mobileuser data", objectId);
  try {
    const db = await getConnection();
    // Find the object by ID in MongoDB
    const object = await db.collection("MobileUsers").findOne({ id: objectId });

    if (!object) {
      return res.status(404).json({ error: "Object not found", state: false });
    }

    // If object found, return it
    res.json({ mess: object, state: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
export const FindCard = async (req: express.Request, res: express.Response) => {
  const cardid = req.params.id;
  try {
    const id = new ObjectId(cardid);
    const db = await getConnection();
    const c = await db.collection("CardsAcc").findOne({ _id: id });
    if (!c) {
      return res.status(400).json({ state: false, mess: "Card not found" });
    }

    // If card is found, return it or do additional processing
    return res.status(200).json({ state: true, mess: c });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ state: false, mess: "An error occurred" });
  }
};
export const FindTransaction = async (
  req: express.Request,
  res: express.Response
) => {
  const cardid = req.params.id;
  try {
    const db = await getConnection();
    const c = await db.collection("Transactions").findOne({ card: cardid });
    if (!c) {
      return res
        .status(400)
        .json({ state: false, mess: "Transaction not found" });
    }

    // If card is found, return it or do additional processing
    return res.status(200).json({ state: true, mess: c });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ state: false, mess: "An error occurred" });
  }
};
