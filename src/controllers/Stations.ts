import express from "express";
import { createStation, findStation } from "../db";
export const FindbyCoor = async (
  req: express.Request,
  res: express.Response
) => {
  const documnetName = req.body.station;
  console.log("get station", documnetName);
  if (!documnetName) {
    return res.status(400).json({ error: "Station parameter is required." });
  }
  const document = await findStation(documnetName as [number, number]);
  if (document) {
    res.status(200).json(document);
  } else {
    res.status(404).json({ error: "Station not found." });
  }
};
export const NewStation = async (
  req: express.Request,
  res: express.Response
) => {
  const { id, name, geoLocation, connections } = req.body;

  try {
    // if (
    //   name !== undefined &&
    //   id !== undefined &&
    //   geoLocation !== undefined &&
    //   connections !== undefined
    // ) {
    console.log("name", name);
    console.log("id", id);
    console.log("geo", geoLocation);
    console.log("con", connections);
    const result = await createStation(name, id, geoLocation, connections);
    if (result === null) {
      return res.status(400);
    } else {
      return res.status(200).json(true);
    }
    // }
  } catch (e) {
    console.error(e);
    return res.status(400);
  }
};
