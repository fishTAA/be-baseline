import express from "express";
import {
  CheckDistance,
  createStation,
  findStation,
  getConnection,
  updatestation,
} from "../db";
import { ObjectId } from "mongodb";
import { station } from "../models";
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
  const { name, id, geoLocation, connections, _id } = req.body;
  const objectId = new ObjectId(_id);
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

// export const CheckConnections=()=>{
//  // Function to add a station to another station's connections
// function addStationToConnection(stationCollection, sourceStationObjid, targetStationObjid) {
//   // Find stations based on objids
//   const sourceStation = stationCollection.find(station => station.objid === sourceStationObjid);
//   const targetStation = stationCollection.find(station => station.objid === targetStationObjid);

//   // Check if both stations exist in the collection
//   if (!sourceStation || !targetStation) {
//       console.error("Stations not found in the collection");
//       return;
//   }

//   // Check if the target station is not already in the connections of the source station
//   if (!sourceStation.connections.includes(targetStation.objid)) {
//       // Add the target station's objid to the connections of the source station
//       sourceStation.connections.push(targetStation.objid);

//       // Also, add the source station's objid to the connections of the target station
//       targetStation.connections.push(sourceStation.objid);

//       console.log(`${sourceStation.name} and ${targetStation.name} are now connected.`);
//   } else {
//       console.log(`${sourceStation.name} and ${targetStation.name} are already connected.`);
//   }
// }

// // Function to remove a station from another station's connections
// function removeStationFromConnection(stationCollection:any, sourceStationObjid:string, targetStationObjid:string) {
//   // Find stations based on objids
//   const sourceStation = stationCollection.find(station => station.objid === sourceStationObjid);
//   const targetStation = stationCollection.find(station => station.objid === targetStationObjid);

//   // Check if both stations exist in the collection
//   if (!sourceStation || !targetStation) {
//       console.error("Stations not found in the collection");
//       return;
//   }

//   // Check if the target station is in the connections of the source station
//   const targetIndex = sourceStation.connections.indexOf(targetStation.objid);
//   if (targetIndex !== -1) {
//       // Remove the target station's objid from the connections of the source station
//       sourceStation.connections.splice(targetIndex, 1);

//       // Also, remove the source station's objid from the connections of the target station
//       const sourceIndex = targetStation.connections.indexOf(sourceStation.objid);
//       targetStation.connections.splice(sourceIndex, 1);

//       console.log(`${sourceStation.name} and ${targetStation.name} are no longer connected.`);
//   } else {
//       console.log(`${sourceStation.name} and ${targetStation.name} are not connected.`);
//   }
// }

// // Example usage:
// const stationCollection = [
//   { name: "StationA", loc: { coordinates: [0, 0] }, connections: [2], objid: 1 },
//   { name: "StationB", loc: { coordinates: [1, 1] }, connections: [1], objid: 2 },
//   { name: "StationC", loc: { coordinates: [2, 2] }, connections: [], objid: 3 }
// ];

// // // Add StationC to the connections of StationA
// // addStationToConnection(stationCollection, 1, 3);

// // // Remove StationB from the connections of StationA
// // removeStationFromConnection(stationCollection, 1, 2);

// }

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
