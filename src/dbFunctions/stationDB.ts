import { getConnection } from "../db";
import { station } from "../models";
import { ObjectId } from "mongodb";

export const CheckDistance = (
  arrstation: Array<station>,
  stationcoor: [number, number]
) => {
  const Stations = arrstation;
  function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const earthRadius = 6371; // Earth radius in kilometers

    // Convert latitude and longitude from degrees to radians
    const lat1Rad = toRadians(lat1);
    const lon1Rad = toRadians(lon1);
    const lat2Rad = toRadians(lat2);
    const lon2Rad = toRadians(lon2);

    // Calculate the differences
    const dlat = lat2Rad - lat1Rad;
    const dlon = lon2Rad - lon1Rad;

    // Haversine formula
    const a =
      Math.sin(dlat / 2) ** 2 +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Calculate distance in meters
    const distance = earthRadius * c * 1000;

    return distance;
  }

  function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  function isWithin500Meters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): boolean {
    const distance = calculateDistance(lat1, lon1, lat2, lon2);
    return distance <= 500;
  }

  const res = Stations.map((station) => {
    const result = isWithin500Meters(
      stationcoor[0],
      stationcoor[1],
      station.geoLocation[0],
      station.geoLocation[1]
    );
    return result ? station._id : null;
  });

  // Filter out null values and return only the station IDs within 500 meters
  return res.filter((stationId) => stationId !== null) as string[];
};

export const SaveConnections = async (
  connections: string[],
  insertedId: string
) => {
  try {
    const db = await getConnection();
    const collection = db.collection("Stations"); // Replace with your collection name

    // Iterate through each object ID in the connections array
    for (const Id of connections) {
      const ojId = new ObjectId(String(Id));

      // Fetch the existing connections for the current object ID
      const existingDocument = await collection.findOne({ _id: ojId });
      if (!existingDocument) {
        return;
      }
      // Add the insertedId to the connections array if not already present
      if (!existingDocument.connections.includes(insertedId)) {
        existingDocument.connections.push(insertedId);

        // Update the document in the collection
        const result = await collection.updateOne(
          { _id: ojId },
          { $set: { connections: existingDocument.connections } }
        );
      }
    }
    console.log(`Connections updated successfully.`);

    return;
  } catch (error) {
    console.error(`Error updating connections: ${error}`);
  }
};

export const DeleteConnection = async (connections: string[], deletedId: string) => {
  try {
    const db = await getConnection();
    const collection = db.collection("Stations"); // Replace with your collection name

    // Iterate through each object ID in the connections array
    for (const Id of connections) {
      const ojId = new ObjectId(String(Id));

      // Fetch the existing connections for the current object ID
      const existingDocument = await collection.findOne({ _id: ojId });
      if (!existingDocument) {
        return console.log("no document");
      }
      console.log("document", existingDocument._id);
      // Remove the deletedId from the connections array if present
      existingDocument.connections = existingDocument.connections.filter(
        (id: string) => id !== deletedId
      );
      console.log("existing connection", existingDocument.connections);
      // Update the document in the collection
      await collection.updateOne(
        { _id: ojId },
        { $set: { connections: existingDocument.connections } }
      );
    }

    console.log(`Connection deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting connection: ${error}`);
  }
};
export const manageConnections = async (
  newConnections: string[],
  insertedId: string
) => {
  const existingConnections = await getExistingConnections(insertedId);
  if (!existingConnections) {
    return console.log("error at fetching old connection");
  }
  // console.log("existing con:", existingConnections);
  const connectionsToAdd = newConnections.filter(
    (connection) => !existingConnections.includes(connection)
  );
  console.log("con to add", connectionsToAdd);
  const connectionsToRemove = existingConnections.filter(
    (connection) => !newConnections.includes(connection)
  );
  console.log("con to remove", connectionsToRemove);

  if (connectionsToAdd.length > 0) {
    await SaveConnections(connectionsToAdd, insertedId);
  }

  if (connectionsToRemove.length > 0) {
    // console.log("to remove", connectionsToRemove);
    await DeleteConnection(connectionsToRemove, insertedId);
  }
};
export const getExistingConnections = async (
  stationId: string
): Promise<string[] | null> => {
  try {
    const db = await getConnection();
    const collection = db.collection("Stations"); // Replace with your collection name

    const existingDocument = await collection.findOne({
      _id: new ObjectId(stationId),
    });
    return existingDocument ? existingDocument.connections : null;
  } catch (error) {
    console.error(`Error retrieving existing connections: ${error}`);
    return null;
  }
};

export const updatestation = async (
  name: string,
  id: number,
  geoLocation: [number, number],
  connections: [string],
  objectId: ObjectId
) => {
  try {
    return await getConnection().then(async (db) => {
      const res = await db.collection("Stations").updateOne(
        { _id: objectId },
        {
          $set: {
            name: name,
            id: id,
            geoLocation: geoLocation,
            connections: connections,
          },
        }
      );
      if (res.modifiedCount > 0) {
        // The update was successful
        console.log(res);
        return true;
      } else {
        // No document was modified, indicating the update was unsuccessful
        console.log(res);
        return false;
      }
    });
  } catch (error) {}
};

export const createStation = async (
  name: string,
  id: number,
  geoLocation: [number, number],
  connections: [string]
) => {
  try {
    const db = await getConnection();
    const res = await db.collection("Stations").insertOne({
      name: name,
      id: id,
      geoLocation: geoLocation,
      connections: connections,
    });
    return res.insertedId;
  } catch (e) {
    console.log("error test", e);
    return null;
  }
};
