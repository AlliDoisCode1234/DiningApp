console.group("index js");
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongodb from "mongodb";
import morgan from "morgan";
import KnownAllergensRouterController from "./Controllers/KnownAllergensRouterController.js";
import "./GlobalScope/database.js";
import DatabaseService from "./Services/DB/DatabaseService.js";

//extract apis and app settings
const {
  appAPIs: [app, MongoClient],
  appConfigurations: { apiPort: port, dbUri },
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

//create pooled database connection object instance
(() => {
  //database client config
  const client = new MongoClient(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10,
  });

  //connect to db
  client.connect((err, client) => {
    if (err !== null) {
      console.error("can not connect to database", err.stack);
      process.exit(1);
    }

    console.log("Connected to database");

    //set globally scoped database object
    DatabaseService.setupDatabase(client.db(process.env.SERVICE_DB));

    app.listen(port, () => {
      console.log(
        `REST API Endpoint ${process.env.SERVICE_NAME} listening on port ${port}`
      );
    });
  });
})();

//global middleware
app.use(cors());
app.use(morgan("common"));
app.use(compression());

//connect controllers / routers
app.use("/", KnownAllergensRouterController);

//request not able to find appropriate server response
app.use("/", (_req, res) => {
  res.send("Request could not be found. No good matching response");
});

console.groupEnd("index js");
