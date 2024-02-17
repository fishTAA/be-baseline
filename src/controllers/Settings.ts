import express from "express";
import { getConnection } from "../db";

export const GetSetting = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    console.log("getting setting");
    await getConnection().then(async (db) => {
      const data = await db
        .collection("settings")
        .findOne({ Title: "Settings" });
      // console.log("res",articles)
      res.status(200).json(data);
    });
  } catch (e) {
    console.error("Error fetching settings:", e);
    res.status(500).send("Internal Server Error");
  }
};
export const UpdateFare = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { newfare, newbal, newpesokm, newoperation } = req.body;
    if (newfare <= 0 || newbal <= 0 || newpesokm <= 0) {
      return res.status(400).send("Cannot be a negative number");
    }
    const db = await getConnection();
    const data = await db.collection("settings").updateOne(
      { Title: "Settings" },
      {
        $set: {
          Fare: newpesokm,
          Balance: newbal,
          MinimumFare: newfare,
          Operations: newoperation,
        },
      }
    );
    // console.log("res",articles)
    if (data.modifiedCount > 0) {
      // The update was successful
      console.log("dadada", data);
      return res.status(200).json({ message: "Succesfully updated" });
    } else {
      // No document was modified, indicating the update was unsuccessful
      console.log(data);
      return res.status(400).json(false);
    }
  } catch (error) {
    res.status(400).send(error);
  }
};
