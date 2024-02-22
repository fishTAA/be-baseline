import { ObjectId } from "mongodb";
import { getConnection } from "../db";

export const NewDevice = async (id: string) => {
  try {
    // Get the database and collection
    const db = await getConnection();
    const mobile = db.collection("MobileUsers");

    // Check if card exists
    const existingTransaction = await mobile.findOne({ id });
    if (existingTransaction) {
      // If card exists, add new transaction to the existing transactions array
      return { state: true, mess: "Welcome Back" };
    } else {
      // If card doesn't exist, create a new transaction
      const newDevice = {
        id,
        cards: [],
      };
      const res = await mobile.insertOne(newDevice);
      if (res.acknowledged) {
        return { state: true, mess: "Welcome to MRT" };
      }
    }
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { state: false, mess: error };
  }
};

export const InsertCard = async (id: string, card: number) => {
  try {
    const db = await getConnection();
    const card1 = await db.collection("CardsAcc").findOne({ cardNum: card });
    if (!card1) {
      return { state: false, mess: "Card Not found" };
    }
    if (card1.device !== null) {
      return { state: false, mess: "Card is already Registered" };
    }
    await db
      .collection("CardsAcc")
      .updateOne({ _id: card1._id }, { $set: { device: id } });
    const res = await db
      .collection("MobileUsers")
      .updateOne({ id: id }, { $push: { cards: String(card1?._id) } });
    if (res.acknowledged) {
      return { state: true, mess: "Successfully added card" };
    }
    return { state: false, mess: "Something went wrong" };
  } catch (error) {
    console.error(error);
    return { state: false, mess: "An error occurred" };
  }
};

