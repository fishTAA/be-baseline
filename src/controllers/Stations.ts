import express from "express";
import {
  createStation,
  findStation,
  getConnection,
  updatestation,
} from "../db";
import { ObjectId } from "mongodb";
import { station } from "../models";
import {
  CheckDistance,
  SaveConnections,
  manageConnections,
} from "../dbFunctions/stationDB";
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

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
  }
};

async function addStationToConnection(
  sourceStationObjid: string,
  targetStationObjid: string
) {
  try {
    const db = await getConnection();
    const stationsCollection = db.collection("Stations");

    // Find stations based on objids
    const sourceStation = await stationsCollection.findOne({
      objid: sourceStationObjid,
    });
    const targetStation = await stationsCollection.findOne({
      objid: targetStationObjid,
    });

    // Check if both stations exist in the collection
    if (!sourceStation || !targetStation) {
      console.error("Stations not found in the collection");
      return;
    }

    // Check if the target station is not already in the connections of the source station
    if (!sourceStation.connections.includes(targetStation.objid)) {
      // Add the target station's objid to the connections of the source station
      await stationsCollection.updateOne(
        { _id: sourceStation.objid },
        { $push: { connections: targetStation.objid } }
      );

      // Also, add the source station's objid to the connections of the target station
      await stationsCollection.updateOne(
        { _id: targetStation.objid },
        { $push: { connections: sourceStation.objid } }
      );

      console.log(
        `${sourceStation.name} and ${targetStation.name} are now connected.`
      );
    } else {
      console.log(
        `${sourceStation.name} and ${targetStation.name} are already connected.`
      );
    }
  } catch (error) {
    console.log(error);
  }
}

// Function to remove a station from another station's connections in MongoDB
async function removeStationFromConnection(
  sourceStationObjid: string,
  targetStationObjid: string
) {
  try {
    const db = await getConnection();
    const stationsCollection = db.collection("Stations");

    // Find stations based on objids
    const sourceStation = await stationsCollection.findOne({
      objid: sourceStationObjid,
    });
    const targetStation = await stationsCollection.findOne({
      objid: targetStationObjid,
    });

    // Check if both stations exist in the collection
    if (!sourceStation || !targetStation) {
      console.error("Stations not found in the collection");
      return;
    }

    // Check if the target station is in the connections of the source station
    const targetIndex = sourceStation.connections.indexOf(targetStation.objid);
    if (targetIndex !== -1) {
      // Remove the target station's objid from the connections of the source station
      await stationsCollection.updateOne(
        { objid: sourceStation.objid },
        { $pull: { connections: targetStation.objid } }
      );

      // Also, remove the source station's objid from the connections of the target station
      await stationsCollection.updateOne(
        { objid: targetStation.objid },
        { $pull: { connections: sourceStation.objid } }
      );

      console.log(
        `${sourceStation.name} and ${targetStation.name} are no longer connected.`
      );
    } else {
      console.log(
        `${sourceStation.name} and ${targetStation.name} are not connected.`
      );
    }
  } catch {}
}
