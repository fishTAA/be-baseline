import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { timeLog } from "console";
import { card, station, user } from "./models";

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
      }
    })
    .catch((e) => {
      console.log("error test", e);
      return null;
    });
};

export const updateBalance = (cardnum: number, balance: number) => {
  return getConnection().then(async (db) => {
    const res = await db
      .collection("CardsAcc")
      .findOneAndUpdate({ cardNum: cardnum }, { $set: { Balance: balance } });
  });
};
