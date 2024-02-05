import { GetCollection } from "../controllers/General";
import { getConnection } from "../db";
import { station } from "../models";
import { ObjectId, WithId } from "mongodb";

interface Station {
  _id: ObjectId;
  name: string;
  connections: string[];
}

// Function to calculate fare using DFS
export async function calculateFare(
  startStation: string,
  endStation: string
): Promise<number> {
  const db = await getConnection();

  try {
    const start = await db
      .collection<Station>("Stations")
      .findOne({ _id: new ObjectId(startStation) });
    const end = await db
      .collection<Station>("Stations")
      .findOne({ _id: new ObjectId(endStation) });
    const articleC = await db.collection<Station>("Stations").find({});
    const stations = await articleC.toArray();
    console.log("start", start);
    console.log("end", end);
    if (!start || !end) {
      return 0; // Invalid stations
    }

    const visited: { [key: string]: boolean } = {};
    const path = await dfs(start._id, end._id, visited, []);
    console.log("path", path);
    if (path.length === 0) {
      return 0; // No valid path
    }

    // Replace with your actual fare calculation logic
    const fare = path.length * 2; // Sample fare calculation (replace with your logic)
    return fare;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

// DFS function for finding a path between start and end stations
async function dfs(
  start: ObjectId,
  end: ObjectId,
  visited: { [key: string]: boolean },
  path: string[]
): Promise<string[]> {
  const db = await getConnection();
  visited[String(start)] = true;
  path.push(String(start));

  if (String(start) === String(end)) {
    return path;
  }

  const stationData = await db
    .collection<Station>("Stations")
    .findOne({ _id: start });

  if (!stationData) {
    throw new Error("Station not found");
  }

  for (const neighbor of stationData.connections) {
    const neighborid = new ObjectId(neighbor);
    console.log("neighbor", neighbor);
    if (!visited[String(neighbor)]) {
      const result = await dfs(neighborid, end, visited, path);
      if (result.length > 0) {
        return result;
      }
    }
  }

  path.pop();
  return [];
}
