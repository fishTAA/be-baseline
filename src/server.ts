// //Importing Libraries
// import express from "express";
// import * as dotenv from "dotenv";
// import {
//   cardgen,
//   checkcard,
//   deleteCard,
//   findData,
//   findStation,
//   findUser,
//   getConnection,
//   updateBalance,
// } from "./db";
// import { card } from "./models";
// import jwt from "jsonwebtoken";
// import { ObjectId } from "mongodb";
// dotenv.config();

// const PORT = process.env.PORT || 3000;
// const JWT_SECRET = process.env.JWT_Secret || "";
// const startServer = (app: express.Express) => {
//   //Listing to the app and running it on PORT 5000

//   app.get("/collection/get", async (req, res) => {
//     const Collection = req.query.collection;
//     await getConnection().then(async (db) => {
//       const articleC = await db.collection(Collection as string).find({});
//       const articles = await articleC.toArray();
//       // console.log("res",articles)
//       res.status(200).send(articles);
//     });
//   });

//   // app.get("/specific/:collection", async (req, res) => {
//   //   const collection = req.params.collection;
//   //   const documnetName = req.query.title;
//   //   if (!documnetName) {
//   //     return res.status(400).json({ error: "Station parameter is required." });
//   //   }
//   //   const carNum = Number(documnetName);
//   //   const document = await findData(collection, carNum);
//   //   if (document) {
//   //     res.json(document);
//   //   } else {
//   //     res.status(404).json({ error: "Station not found." });
//   //   }
//   // });
//   // app.post("/findstation", async (req, res) => {
//   //   const documnetName = req.body.station;
//   //   if (!documnetName) {
//   //     return res.status(400).json({ error: "Station parameter is required." });
//   //   }
//   //   const document = await findStation(documnetName as [number, number]);
//   //   if (document) {
//   //     res.json(document);
//   //   } else {
//   //     res.status(404).json({ error: "Station not found." });
//   //   }
//   // });
//   // app.post("/check-token", (req, res) => {
//   //   const { token } = req.body;

//   //   // Check if the token is present
//   //   if (!token) {
//   //     return res
//   //       .status(400)
//   //       .json({ isValid: false, message: "Token is missing" });
//   //   }

//   //   try {
//   //     // Verify the token using the secret key
//   //     const decoded = jwt.verify(token, JWT_SECRET);
//   //     console.log("decoded", decoded);

//   //     // If verification is successful, the token is considered valid
//   //     res.json({ isValid: true, message: "Token is valid" });
//   //   } catch (error) {
//   //     // If verification fails, the token is considered invalid or tampered with
//   //     console.log(error, token);

//   //     res.json({
//   //       isValid: false,
//   //       message: "Token is invalid or tampered with",
//   //     });
//   //   }
//   // });
//   // app.post("/user/login", async (req, res) => {
//   //   const username = req.body.username.replace(/\s/g, "") as string;
//   //   const password = req.body.pass as string;
//   //   const user = await findUser(username);
//   //   if (user && user?.password === password) {
//   //     const token = jwt.sign(
//   //       {
//   //         username: user?.userName,
//   //         firstname: user?.firstName,
//   //         lastname: user?.lastName,
//   //       },
//   //       JWT_SECRET,
//   //       {
//   //         expiresIn: "2h",
//   //       }
//   //     );
//   //     res.status(200).send({
//   //       jwt: token,
//   //     });
//   //   } else {
//   //     res.status(401).send({
//   //       message: "access denied",
//   //     });
//   //   }
//   // });
//   // app.post("/newCard", async (req, res) => {
//   //   try {
//   //     const card = req.body.cardnum as number;
//   //     const bal = req.body.balance as number;
//   //     const result = await cardgen(card, bal);
//   //     console.log(result);
//   //     if (result === null) {
//   //       return res.status(400);
//   //     } else {
//   //       return res.status(200).json(true);
//   //     }
//   //   } catch (e) {
//   //     console.error(e);
//   //     return res.status(400);
//   //   }
//   // });
//   // app.get("/checkcardnum", async (req, res) => {
//   //   try {
//   //     const cardnum = req.query.cardnum as string;
//   //     const card = +cardnum;
//   //     const document = await checkcard(card);
//   //     console.log(document);
//   //     if (document) {
//   //       res.json(true);
//   //     } else {
//   //       res.json(false);
//   //     }
//   //   } catch (e) {
//   //     console.error(e);
//   //   }
//   // });
//   // app.post("/addbal", async (req, res) => {
//   //   try {
//   //     const card = req.body.cardnum;
//   //     const bal = req.body.balance;
//   //     console.log(card, bal);
//   //     const document = await updateBalance(Number(card), Number(bal));
//   //     console.log(document);
//   //     if (document) {
//   //       res.status(200).json(true);
//   //     } else {
//   //       res.status(400).json(false);
//   //     }
//   //   } catch (e) {
//   //     console.error(e);
//   //   }
//   // });
//   app.post("/updateSettingfare", async (req, res) => {
//     try {
//       const newval = req.body.fare;
//       if (newval < 0) {
//         return res.status(400).send("Cannot be a negative number");
//       }
//       const db = await getConnection();
//       const data = await db
//         .collection("settings")
//         .updateOne({ Title: "Settings" }, { $set: { Fare: newval } });
//       // console.log("res",articles)
//       if (data.modifiedCount > 0) {
//         // The update was successful
//         console.log("dadada", data);
//         return res.status(200).send("Succesfully updated");
//       } else {
//         // No document was modified, indicating the update was unsuccessful
//         console.log(data);
//         return res.status(400).send("Error updating fare");
//       }
//     } catch (error) {
//       res.status(400).send(error);
//     }
//   });
//   // app.delete("/deletecard", async (req, res) => {
//   //   try {
//   //     const card = req.body.cardnum;
//   //     const document = await deleteCard(Number(card));
//   //     console.log(document);
//   //     if (document) {
//   //       res.status(200).json(true);
//   //     } else {
//   //       res.status(400).json(false);
//   //     }
//   //   } catch (e) {
//   //     console.error(e);
//   //   }
//   // });
//   app.get("/settings", async (req, res) => {
//     try {
//       await getConnection().then(async (db) => {
//         const data = await db
//           .collection("settings")
//           .findOne({ Title: "Settings" });
//         // console.log("res",articles)
//         res.status(200).json(data);
//       });
//     } catch (e) {
//       console.error("Error fetching settings:", e);
//       res.status(500).send("Internal Server Error");
//     }
//   });
//   app.listen(PORT, async () => {
//     console.log(`listning on port ${PORT}`);
//   });
// };

// export default startServer;
