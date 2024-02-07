import { GetCollection } from "../controllers/General";
import { getConnection } from "../db";
import { station } from "../models";
import { ObjectId, WithId } from "mongodb";

interface Station {
  _id: ObjectId;
  name: string;
  geoLocation: [number, number];
  connections: string[];
}
interface Res {
  fare: number;
  path?: string[];
}
// Function to calculate fare using DFS
export async function calculateFare(
  startStation: string,
  endStation: string
): Promise<Res> {
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
      return { fare: 0, path: [] }; // Invalid stations
    }

    const visited: { [key: string]: boolean } = {};
    const path = await dfs(start._id, end._id, visited, []);
    console.log("path", path);
    if (path.length === 0) {
      return { fare: 0, path: [] }; // Invalid stations
    }

    // Replace with your actual fare calculation logic
    const fare = await calculateTotalDistance(path); // Sample fare calculation (replace with your logic)
    console.log("distance", fare);

    return { fare: Number(fare), path: path };
  } catch (error) {
    console.error(error);
    return { fare: 0, path: [] };
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

// Function to calculate Haversine distance between two geo locations
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Implementation of the Haversine formula
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

// Function to calculate total distance of a path using Haversine formula
async function calculateTotalDistance(path: string[]): Promise<number> {
  let totalDistance = 0;
  const db = await getConnection();
  for (let i = 0; i < path.length - 1; i++) {
    const current = path[i];
    const next = path[i + 1];

    const currentStation = await db
      .collection<Station>("Stations")
      .findOne({ _id: new ObjectId(current) });

    const nextStation = await db
      .collection<Station>("Stations")
      .findOne({ _id: new ObjectId(next) });

    if (currentStation && nextStation) {
      const [lat1, lon1] = currentStation.geoLocation.map(Number);
      const [lat2, lon2] = nextStation.geoLocation.map(Number);

      totalDistance += haversineDistance(lat1, lon1, lat2, lon2);
    }
  }

  return totalDistance;
}
