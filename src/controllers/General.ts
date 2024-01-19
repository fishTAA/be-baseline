import express from "express";
import { getConnection } from "../db";

export const GetCollection = async (
  req: express.Request,
  res: express.Response
) => {
  const Collection = req.query.collection;
  await getConnection().then(async (db) => {
    const articleC = await db.collection(Collection as string).find({});
    const articles = await articleC.toArray();
    // console.log("res",articles)
    res.status(200).send(articles);
  });
};
