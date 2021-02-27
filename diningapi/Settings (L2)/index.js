console.group("index js");
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongodb from "mongodb";
import morgan from "morgan";
import SettingsRouterController from "./Controllers/SettingsRouterController.js";
import "./GlobalScope/database.js";

//extract apis and app settings
const {
  appAPIs: [app],
  appConfigurations: { apiPort: port },
} = (() => {
  // app additional lib setup
  dotenv.config();
  const { MongoClient } = mongodb;
  const app = express();
  // app settings
  const apiPort = process.env.SERVICE_PORT;
  const dbUri = `mongodb+srv://${process.env.SERVICE_DB_CREDENTIALS}@${process.env.SERVICE_DB_EP}/${process.env.SERVICE_DB}?retryWrites=true&w=majority`;
  return { appAPIs: [app, MongoClient], appConfigurations: { apiPort, dbUri } };
})();

//global middleware
app.use(cors());
app.use(morgan("common"));
app.use(compression());

//connect controllers / routers
app.use("/", SettingsRouterController);

//request not able to find appropriate server response
app.use("/", (_req, res) => {
  res.send("Request could not be found. No good matching response");
});

app.listen(port, () => {
  console.log(
    `REST API Endpoint ${process.env.SERVICE_NAME} listening on port ${port}`
  );
});

console.groupEnd("index js");
