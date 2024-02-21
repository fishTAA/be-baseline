import express from "express";
import { NewDevice } from "../dbFunctions/mobileDB";

export const CreateNewDevice = async (
  req: express.Request,
  res: express.Response
) => {
  const uniqID = req.body.ID;
  console.log("creating new device with id",uniqID)
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
