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
