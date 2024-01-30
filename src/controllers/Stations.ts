import express from "express";
import {
  CheckDistance,
  createStation,
  findStation,
  getConnection,
  updatestation,
} from "../db";
import { ObjectId } from "mongodb";
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
    console.log("name", name);
    console.log("id", id);
    console.log("geo", geoLocation);
    console.log("con", connections);
    const result = await createStation(
      name,
      Number(id),
      geoLocation,
      connections
    );
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
export const UpdateStation = async (
  req: express.Request,
  res: express.Response
) => {
  const { name, id, geoLocation, connections, objid } = req.body;
  const objectId = new ObjectId(objid);
  try {
    const query = { _id: objectId };
    const findResult = await getConnection().then(async (db) => {
      return await db.collection("Stations").findOne(query);
    });
    console.log(findResult);
    if (!findResult) {
      return res.status(400).send({ message: "Document not Found" });
    }

    const ret = await updatestation(
      name,
      id,
      geoLocation,
      connections,
      objectId
    );

    if (ret) {
      res.status(200).json(true);
    } else {
      res.status(400).json(false);
    }
  } catch (e) {
    console.error(e);
    return res.status(400);
  }
};

export const CheckStationDistance = async (
  req: express.Request,
  res: express.Response
) => {
  const { stations, coor } = req.body;
  // console.log("check dis", stations, coor);
  try {
    const ret = CheckDistance(stations, coor);
    console.log("ret dist", ret);
    if (ret) {
      res.status(200).json(ret);
    } else {
      res.status(400).json(false);
    }
  } catch (e) {
    console.error(e);
    return res.status(400);
  }
};
