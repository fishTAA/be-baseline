// import express, { Application } from "express";
// import dotenv from "dotenv";
// import * as http from "http";
// import cors from "cors";
// import router from "./router";
// import { getConnection } from "./db";

// dotenv.config();
// const app: Application = express();
// const port = process.env.PORT || "8000";
// const server = http.createServer(app);
// app.use(cors());
// // app.use(express.urlencoded());
// app.use(express.json());
// app.use("/", router());

// getConnection().then(() => {
//   server.listen(port, () => {
//     console.log(`Server Launched at http://localhost:${port}`);
//     console.log(`Web Socket Server Launched at ws://localhost:${port}`);
//   });
// });
