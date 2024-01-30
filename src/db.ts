import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { error, timeLog } from "console";
import { card, station, user } from "./models";
import { GetCollection } from "./controllers/General";

const client = new MongoClient(
  "mongodb+srv://tom31aguila:bBMF3lnMspgrZmh8@cluster0.q7hahj8.mongodb.net/"
);

let conn: MongoClient;
const makeConnection = async () => {
  try {
    await client.connect().then((con) => (conn = con));
    console.log("Connected to DB");
  } catch (e) {
    console.error(e);
  }
};

export const getConnection = async (): Promise<Db> => {
  if (!conn) {
    await makeConnection();
  }
  const dbConnection: Db = conn.db("metroDB");
  return dbConnection;
};

export const findData = async (
  collection: string,
  cardNum: number
): Promise<card | null> => {
  return getConnection()
    .then(async (db) => {
      const c = await db.collection<card>(collection).findOne({ cardNum });
      console.log(c);
      return c;
    })
    .catch((e) => {
      console.log("error", e);
      return null;
    });
};
export const findUser = async (user: string): Promise<user | null> => {
  return getConnection()
    .then(async (db) => {
      const c = await db.collection<user>("Users").findOne({ userName: user });
      console.log(c);
      return c;
    })
    .catch((e) => {
      console.log("error", e);
      return null;
    });
};
export const findStation = async (
  loc: [number, number]
): Promise<station | null> => {
  return getConnection()
    .then(async (db) => {
      console.log(loc);
      // const test = [14.542345632258723,121.01939792931009]
      const c = await db
        .collection<station>("Stations")
        .findOne({ geoLocation: loc });
      console.log("return obj", c);
      return c;
    })
    .catch((e) => {
      console.log("error test", e);
      return null;
    });
};

// export const findData = async (collection:string,dataname: string) => {
//     return getConnection().then(async (db)=> {
//       // const query = {cardNum:dataname}
//       const c = db.collection(collection).findOne({dataname})
//       console.log(c)
//       return c;
//     }).catch((e)=> {
//       console.log("error", e)
//       return null;
//     })
// }
// export const findData = async <T>(collection: string, documentname: string): Promise<T | null> => {
//   try {
//     const db = await getConnection();
//     const result = await db.collection<T>(collection).findOne({name:documentname });
//     console.log(result);
//     return result;
//   } catch (e) {
//     console.log("error", e);
//     return null;
//   }
// };

export const cardgen = (cardnum: number, balance: number) => {
  return getConnection()
    .then(async (db) => {
      const res = await db.collection("CardsAcc").insertOne({
        cardNum: cardnum,
        Balance: balance,
        state: null,
      });
      return { id: res.insertedId };
    })
    .catch((e) => {
      console.log("error test", e);
      return null;
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
export const deleteCard = async (cardnum: number) => {
  try {
    const db = await getConnection();
    const deleteResult = await db
      .collection("CardsAcc")
      .deleteOne({ cardNum: cardnum });

    console.log("deleting", cardnum);

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
    return { id: res.insertedId };
  } catch (e) {
    console.log("error test", e);
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
