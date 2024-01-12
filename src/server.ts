//Importing Libraries
import express from "express";
import * as dotenv from "dotenv";
import {
  cardgen,
  checkcard,
  findData,
  findStation,
  findUser,
  getConnection,
} from "./db";
import { card } from "./models";
import jwt from "jsonwebtoken";
dotenv.config();

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_Secret || "";
const startServer = (app: express.Express) => {
  //Listing to the app and running it on PORT 5000

  app.get("/collection/get", async (req, res) => {
    const Collection = req.query.collection;
    await getConnection().then(async (db) => {
      const articleC = await db.collection(Collection as string).find({});
      const articles = await articleC.toArray();
      // console.log("res",articles)
      res.status(200).send(articles);
    });
  });

  app.get("/specific/:collection", async (req, res) => {
    const collection = req.params.collection;
    const documnetName = req.query.title as string;
    if (!documnetName) {
      return res.status(400).json({ error: "Station parameter is required." });
    }
    const carNum = +documnetName;
    const document = await findData(collection, carNum);
    if (document) {
      res.json(document);
    } else {
      res.status(404).json({ error: "Station not found." });
    }
  });
  app.post("/findstation", async (req, res) => {
    const documnetName = req.body.station;
    if (!documnetName) {
      return res.status(400).json({ error: "Station parameter is required." });
    }
    const document = await findStation(documnetName as [number, number]);
    if (document) {
      res.json(document);
    } else {
      res.status(404).json({ error: "Station not found." });
    }
  });

  app.post("/user/login", async (req, res) => {
    const username = req.body.username.replace(/\s/g, "") as string;
    const password = req.body.pass as string;
    const user = await findUser(username);
    if (user && user?.password === password) {
      const token = jwt.sign(
        {
          username: user?.userName,
          firstname: user?.firstName,
          lastname: user?.lastName,
        },
        JWT_SECRET,
        {
          expiresIn: "2h",
        }
      );
      res.status(200).send({
        jwt: token,
      });
    } else {
      res.status(401).send({
        message: "access denied",
      });
    }
  });
  app.post("/newCard", async (req, res) => {
    try {
      const card = req.body.cardnum as number;
      const bal = req.body.balance as number;
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
  });
  app.get("/checkcardnum", async (req, res) => {
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
  });
  app.listen(PORT, async () => {
    console.log(`listning on port ${PORT}`);
  });
};

export default startServer;
