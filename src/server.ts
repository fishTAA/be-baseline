//Importing Libraries 
import express from 'express'
import * as dotenv from 'dotenv';
import { findStation, getConnection } from './db';
dotenv.config();

const PORT = process.env.PORT || 3000

const startServer = (app: express.Express) => {
  //Listing to the app and running it on PORT 5000

  app.get("/collection/get", async (req, res) => {
    const Collection = req.query.collection
    await getConnection().then(async (db)=>{
    const articleC = await db.collection(Collection as string).find({});
    const articles = await articleC.toArray(); 
     // console.log("res",articles)
     res.status(200).send(articles)
    })
   })





  app.get('/findStation/:collection', async (req, res) => {
    const collection = req.params.collection;
    const stationName = req.query.title as string;
  
    if (!stationName) {
      return res.status(400).json({ error: 'Station parameter is required.' });
    }
  
    const document = await findStation(collection, stationName);
  
    if (document) {
      res.json(document);
    } else {
      res.status(404).json({ error: 'Station not found.' });
    }
  });

  app.listen(PORT, async () => {
    console.log(`listning on port ${PORT}`)
 })

}

export default startServer;