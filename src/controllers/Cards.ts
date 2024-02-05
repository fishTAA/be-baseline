import express from "express";
import { cardgen, findData} from "../db";
import { checkcard, deleteCard, updateBalance } from "../dbFunctions/cardDB";
import { getSingleStation } from "../dbFunctions/stationDB";
import { error } from "console";
import { WithId } from "mongodb";
import { station } from "../models";

export const NewCard = async (req: express.Request, res: express.Response) => {
  try {
    const card = req.body.cardnum as number;
    const bal = req.body.balance as number;
    if (card === null) {
      return res.status(400);
    }
    const result = await cardgen(card, bal);
    console.log(result);

    if (result === null) {
      return res.status(400);
    } else {
      return res.status(200).json(true);
    }
  } catch (e) {
    console.error(e);
    return res.status(400);
  }
};
export const DeleteCard = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const card = req.body.cardnum;
    console.log("deleting card:", card);
    const document = await deleteCard(Number(card));
    console.log(document);
    if (document) {
      res.status(200).json(true);
    } else {
      res.status(400).json(false);
    }
  } catch (e) {
    console.error(e);
  }
};

export const AddCardBal = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const card = req.body.cardnum;
    const bal = req.body.balance;
    console.log(card, bal);
    const document = await updateBalance(Number(card), Number(bal));
    console.log(document);
    if (document) {
      res.status(200).json(true);
    } else {
      res.status(400).json(false);
    }
  } catch (e) {
    console.error(e);
  }
};
export const CheckCard = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const cardnum = req.query.cardnum as string;
    const card = +cardnum;
    const document = await checkcard(card);
    console.log(document);
    if (document) {
      res.json(true);
    } else {
      res.json(false);
    }
  } catch (e) {
    console.error(e);
  }
};
export const CardCollection = async (
  req: express.Request,
  res: express.Response
) => {
  const collection = req.params.collection;
  const documnetName = req.query.title;
  if (!documnetName) {
    return res.status(400).json({ error: "Station parameter is required." });
  }
  const carNum = Number(documnetName);
  const document = await findData(collection, carNum);
  if (document) {
    res.json(document);
  } else {
    res.status(404).json({ error: "Card not found." });
  }
};


// interface Station {
//   _id: string;
//   name: string;
//   id: number;
//   geoLocation: [number, number];
//   connections: string[];
// }

// interface Card {
//   _id:   string 
//   cardNum: number;
//   Balance: number;
//   state: any; // You may need to define a specific type for "state" based on your needs
// }

// interface TapTransaction {
//   card: Card;
//   station: Station;
//   tapInTime: Date;
//   tapOutTime?: Date;
// }

// function calculateFare(distanceInKm: number): number {
//   // Implement your fare calculation logic based on distance
//   // This is a placeholder, replace it with your actual calculation
//   const farePerKm = 0.1;
//   return distanceInKm * farePerKm;
// }

// function tapIn(card: Card, station: Station): TapTransaction {
//   const tapInTime = new Date();
//   const transaction: TapTransaction = {
//     card,
//     station,
//     tapInTime,
//   };
//   return transaction;
// }

// function dfs(
//   startStation: station,
//   targetStationId: number,
//   visited: Set<number>,
//   path: Station[]
// ): boolean {
//   if (startStation.id === targetStationId) {
//     path.push(startStation);
//     return true;
//   }

//   visited.add(startStation.id);
//   path.push(startStation);

//   for (const connectionId of startStation.connections) {
//     if (!visited.has(Number(connectionId))) {
//       const nextStation = getSingleStation(connectionId);
//       if(nextStation!==null){
//       if (nextStation && dfs(nextStation, targetStationId, visited, path)) {
//         return true;
//       }
//     }
//     }
//   }

//   path.pop();
//   return false;
// }

//  async function   getStationById(stationId: string):   {
//   const Station = await getSingleStation(stationId)
//   if(Station){
//     return Station
//   }else{
//     console.log("cannot find station with id:",stationId)
//     return
//   }

// }

// function tapOut(
//   transaction: TapTransaction,
//   tapOutStationId: number
// ): { success: boolean; fare?: number } {
//   if (transaction.tapOutTime) {
//     throw new Error("Card already tapped out for this transaction");
//   }

//   const tapOutTime = new Date();
//   transaction.tapOutTime = tapOutTime;

//   const visited = new Set<number>();
//   const path: Station[] = [];

//   if (dfs(transaction.station, tapOutStationId, visited, path)) {
//     // Calculate distance based on the traversal path
//     const distanceInKm = calculateDistanceFromPath(path);

//     // Calculate fare based on distance
//     const fare = calculateFare(distanceInKm);

//     // Deduct fare from card balance
//     if (fare > transaction.card.Balance) {
//       return { success: false };
//     }

//     transaction.card.Balance -= fare;

//     return { success: true, fare };
//   } else {
//     return { success: false };
//   }
// }

// function calculateDistanceFromPath(path: Station[]): number {
//   // Implement your distance calculation logic based on the traversal path
//   // This is a placeholder, replace it with your actual calculation
//   let totalDistance = 0;
//   for (let i = 0; i < path.length - 1; i++) {
//     const [lat1, lon1] = path[i].geoLocation;
//     const [lat2, lon2] = path[i + 1].geoLocation;
//     totalDistance += calculateDistance([lat1, lon1], [lat2, lon2]);
//   }
//   return totalDistance;
// }

// function calculateDistance(
//   location1: [number, number],
//   location2: [number, number]
// ): number {
//   // Implement your distance calculation logic
//   // This is a placeholder, replace it with your actual calculation
//   const [lat1, lon1] = location1;
//   const [lat2, lon2] = location2;
//   const earthRadius = 6371; // Earth's radius in kilometers
//   const dLat = degToRad(lat2 - lat1);
//   const dLon = degToRad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(degToRad(lat1)) *
//       Math.cos(degToRad(lat2)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const distance = earthRadius * c;

//   return distance;
// }

// function degToRad(degrees: number): number {
//   return degrees * (Math.PI / 180);
// }

// // Example usage:
// const station: Station = {
//   _id:  "65bbfa6fee811cd69621cebb" ,
//   name: "Taft 4",
//   id: 1,
//   geoLocation: [14.53756542928771, 121.00144805171377],
//   connections: ["65bbfa82ee811cd69621cebc"],
// };

// const card: Card = {
//   _id: "65a05df1671b75520649b45e" ,
//   cardNum: 6378796345441216,
//   Balance: 2533,
//   state: null,
// };

// const tapTransaction = tapIn(card, station);
// console.log("Tap In Transaction:", tapTransaction);

// const tapOutStationId = 2; // Replace with the actual station ID for tap out
// const tapOutResult = tapOut(tapTransaction, tapOutStationId);

// if (tapOutResult.success) {
//   console.log("Fare Deducted:", tapOutResult.fare);
//   console.log("Updated Card Balance:", card.Balance);
// } else {
//   console.log("Tap Out failed");
// }
