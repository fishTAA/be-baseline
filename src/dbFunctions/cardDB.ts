import { ObjectId } from "mongodb";
import { getConnection } from "../db";

export const deleteCard = async (cardnum: number) => {
  try {
    const db = await getConnection();
    const card = await db.collection("CardsAcc").findOne({ cardNum: cardnum });
    if (!card) {
      return false;
    }

    const deleteTransaction = await db
      .collection("Transactions")
      .deleteOne({ card: String(card._id) });
    console.log("deleting", cardnum);
    const deleteResult = await db
      .collection("CardsAcc")
      .deleteOne({ _id: card._id });
    if (deleteResult.deletedCount > 0) {
      // The deletion was successful
      console.log(deleteResult);
      return true;
    } else {
      // No document was deleted, indicating the deletion was unsuccessful
      console.log(deleteResult);
      return false;
    }
  } catch (error) {
    console.error("Error deleting card:", error);
    // Handle the error or rethrow it based on your requirements
    throw error;
  }
};

export const updateBalance = async (cardnum: number, balance: number) => {
  return getConnection()
    .then(async (db) => {
      const updateResult = await db
        .collection("CardsAcc")
        .updateOne({ cardNum: cardnum }, { $set: { Balance: balance } });
      console.log("updating", cardnum, balance);
      if (updateResult.modifiedCount > 0) {
        // The update was successful
        console.log(updateResult);
        return true;
      } else {
        // No document was modified, indicating the update was unsuccessful
        console.log(updateResult);
        return false;
      }
    })
    .catch((error) => {
      console.error("Error updating balance:", error);
      // Handle the error or rethrow it based on your requirements
      throw error;
    });
};

export const checkcard = (cardnum: number) => {
  return getConnection()
    .then(async (db) => {
      const res = await db.collection("CardsAcc").findOne({
        cardNum: cardnum,
      });
      if (res != null) {
        return true;
      } else {
        return false;
      }
    })
    .catch((e) => {
      console.log("error test", e);
      return null;
    });
};

export const getSingleCard = (_id: string) => {
  const objid = new ObjectId(_id);

  return getConnection()
    .then(async (db) => {
      const res = await db.collection("CardsAcc").findOne({
        _id: objid,
      });
      if (res != null) {
        return res;
      } else {
        return false;
      }
    })
    .catch((e) => {
      console.log("error test", e);
      return null;
    });
};
