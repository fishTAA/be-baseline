import express from "express";
import { findStation, getConnection } from "../db";
import { ObjectId, WithId } from "mongodb";
import { Setting, station } from "../models";
import {
  CheckDistance,
  DeleteConnection,
  SaveConnections,
  createStation,
  getSingleStation,
  manageConnections,
  updatestation,
} from "../dbFunctions/stationDB";
import { calculateFare } from "../dbFunctions/farecalculation";
import { TransactionIn, TransactionOut } from "../dbFunctions/transactions";
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
      await SaveConnections(connections, String(result));
      return res.status(200).json(result);
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
  console.log(name, id, geoLocation, connections, objid);
  try {
    const query = { _id: objectId };
    const findResult = await getConnection().then(async (db) => {
      return await db.collection("Stations").findOne(query);
    });
    await manageConnections(connections, String(objectId));

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
export const DeleteStation = async (
  req: express.Request,
  res: express.Response
) => {
  const stationid = req.params.id;
  const connections = req.body.connections;
  console.log("deleting Station:", stationid);
  if (!stationid) {
    return res.status(400).json({ error: "Invalid Station ID parameter" });
  }
  try {
    const objectId = new ObjectId(String(stationid));
    const query = { _id: objectId };

    const deleteResult = await getConnection().then(async (db) => {
      return await db.collection("Stations").deleteOne(query);
    });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ error: "Embedding not found" });
    }
    await DeleteConnection(connections, stationid);
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
  }
};
export const Tapin = async (req: express.Request, res: express.Response) => {
  const cardNum = req.body.cardNum;
  const stationId = req.body.stationId;
  const db = await getConnection();
  try {
    const card = await db.collection("CardsAcc").findOne({ cardNum });
    const station = await db
      .collection("Stations")
      .findOne({ _id: new ObjectId(stationId) });
    if (!card && !station) {
      return res
        .status(404)
        .json({ message: "Card or station not found", state: false });
    }
    if (card) {
      if (card.state !== null) {
        return res
          .status(404)
          .json({ message: "Card or station not found", state: false });
      }
    }
    if (card && station) {
      await db
        .collection("CardsAcc")
        .updateOne({ cardNum }, { $set: { state: String(station._id) } });

      TransactionIn(String(card._id), stationId);
      res.status(200).json({ message: "Tap in successful", state: true });
    } else {
      res
        .status(404)
        .json({ message: "Card or station not found", state: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", state: false });
  }
};
export const Tapout = async (req: express.Request, res: express.Response) => {
  const cardNum = req.body.cardNum;
  const stationId = req.body.stationId;
  const db = await getConnection();

  try {
    const card = await db.collection("CardsAcc").findOne({ cardNum });
    const setting = await db
      .collection("settings")
      .findOne({ Title: "Settings" });
    if (card) {
      if (card.state === null) {
        return res.status(404).json({
          status: false,
          message: "Card is not tapin",
          cost: 0,
          path: [],
          distance: 0,
        });
      }
    }
    if (card && setting) {
      const fare = await calculateFare(card.state, stationId);
      const minimumfare = await setting.MinimumFare;
      const fareperkm = await setting.Fare;
      if (card.Balance < Math.round(fare.fare) + minimumfare) {
        console.log("balance", card.Balnce);
        return res.status(404).json({
          status: false,
          message: "Card  doesnt have enough balance",
          cost: 0,
          path: [],
          distance: 0,
        });
      }
      // console.log(fare.path);
      if (fare.path?.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Stations Are not Connected",
          path: fare.path,
          distance: 0,
        });
      }
      let bal = Math.round(fare.fare) * fareperkm + minimumfare;
      if (bal < minimumfare) {
        bal = minimumfare;
      }
      await db
        .collection("CardsAcc")
        .updateOne(
          { cardNum },
          { $set: { state: null }, $inc: { Balance: -bal } }
        );
      TransactionOut(String(card._id), stationId, bal, Math.round(fare.fare));
      res.status(200).json({
        status: true,
        message: "Tap out successful",
        path: fare.path,
        cost: bal,
        distance: Math.round(fare.fare),
      });
    } else {
      res.status(404).json({ message: "Card or station not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const CheckConnections = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const db = await getConnection();
    const articleC = await db.collection("Stations").find({});
    const stations = await articleC.toArray();

    // Check if any station has empty connections
    const hasEmptyConnections = stations.some(
      (station) =>
        !station.connections ||
        station.connections.length === 0 ||
        station.connections.some((connection: string[]) => !connection)
    );
    console.log(hasEmptyConnections);
    return res.status(200).json(hasEmptyConnections);
  } catch (e) {
    console.error(e);
    return res
      .status(400)
      .json({ error: "An error occurred while checking connections" });
  }
};
