import express from "express";
import { findStation } from "../db";

export const FindbyCoor = async (req: express.Request, res: express.Response) => {
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
  };

  