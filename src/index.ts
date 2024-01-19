import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
const PORT = process.env.PORT || 3000;
//import startServer from 'server';
import router from "./router";
import * as http from "http";

//App Varaibles
dotenv.config();
//intializing the express app
const app = express();
const port = process.env.PORT || "8000";

//using the dependancies
app.use(helmet());
app.use(cors());
app.use(express.json());
// establishConnection=()=>{
app.use("/", router());
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server Launched at http://localhost:${port}`);
});
// }
