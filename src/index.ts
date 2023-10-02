import {  Sequelize } from "sequelize";
import * as express from 'express';
import {pingTestInit} from "./models/PingTest";
import initTables from "./utils/initTables";
import router from "./routes";

import {DB_URI, PRODUCTION, PORT, BASE_URL} from './utils/Envs'

console.info("APP CONFIGS -----------");
console.info("PRODUCTION: ", PRODUCTION);
console.info("DB_URI: ", DB_URI);
console.info("PORT: ", PORT);
console.info("BASE_URL: ", BASE_URL);
console.info("-----------------------\n\n");

const sequelize = new Sequelize(DB_URI, {...PRODUCTION && {
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true,
    },
  }
}});
initTables(sequelize, pingTestInit);

const app = express();
app.use('/' + BASE_URL, router);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


(async function () {
  await sequelize.sync();
  console.info("Db auth completed\n");
  app.listen(PORT, () => {
    console.info("Listening on port: " + PORT);
  });
})();
