import { Collection, Db, MongoClient, ObjectId} from 'mongodb';
import { timeLog } from 'console';

interface station{
    stationName: string;

  }

const client = new MongoClient("mongodb+srv://tom31aguila:bBMF3lnMspgrZmh8@cluster0.q7hahj8.mongodb.net/");

let conn: MongoClient;
const makeConnection = async () => {
  try {
    await client.connect().then(con => conn = con);
    console.log("Connected to DB")
  } catch(e) {
    console.error(e);
  }  
}


export const getConnection = async (): Promise<Db> => {
  if (!conn) {
    await makeConnection();
  }
  const dbConnection: Db = conn.db("metroDB");
  return dbConnection;
}

export const findStation = async (collection:string,stationName: string): Promise<station | null > => {
    return getConnection().then(async (db)=> {
      const c = db.collection<station>(collection).findOne({stationName})
      console.log(c)
      return c;
    }).catch((e)=> {
      console.log("error", e)
      return null;
    })
  
  }