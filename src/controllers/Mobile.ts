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
      return res
        .status(400)
        .json({ message: "Card name is required", state: false });
    }
    const ret = await InsertCard(id, newCard);
    console.log("ret", ret);
    if (ret.state) {
      return res.status(200).json(ret);
    }
    return res.status(400).json(ret);
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
export const UnlinkCard = async (
  req: express.Request,
  res: express.Response
) => {
  const userid = req.params.id;
  const cardIdsToRemove = req.body.cards;
  const deletedata = req.body.deletedata;
  console.log("unlinking cards:", cardIdsToRemove);
  try {
    // Connect to MongoDB
    const db = await getConnection();

    // Define the collections
    const mobileUsersCollection = await db.collection("MobileUsers");
    const cardsCollection = await db.collection("CardsAcc");
    const cardids = await Promise.all(
      cardIdsToRemove.map(async (cardId: number) => {
        const cards = await cardsCollection.findOne({ cardNum: cardId });
        return cards;
      })
    );
    // Update the MobileUsers document to remove the specified cards from the array
    const result = await mobileUsersCollection.updateOne(
      { id: userid },
      { $pull: { cards: { $in: cardids.map((card) => String(card._id)) } } }
    );
    // Update the device field to null for each card
    const cardUpdatePromises = cardids.map((card) => {
      if (card) {
        return cardsCollection.updateOne(
          { _id: card._id },
          { $set: { device: null } }
        );
      }
      return null;
    });

    // Execute all card update operations
    await Promise.all(cardUpdatePromises);
    if (deletedata) {
      const result = await mobileUsersCollection.deleteOne({ id: userid });
      if (result.deletedCount > 0) {
        return res.status(200).json({ mess: "Deleted User", state: true });
      }
      return res
        .status(400)
        .json({ mess: "Failed to Delete User", state: false });
    }

    // Check if the update was successful
    if (result.modifiedCount >= 1) {
      res.status(200).json({ mess: "Cards removed successfully", state: true });
    } else {
      res.status(404).json({ mes: "Cards not found", state: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ mess: "Internal Server Error", state: false });
  }
};
