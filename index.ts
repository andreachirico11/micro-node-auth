import { DataTypes, Sequelize } from "sequelize";
import * as express from 'express';
import {DB_URI, PRODUCTION, PORT} from './utils/Envs'

console.info("APP CONFIGS -----------");
console.info("PRODUCTION: ", PRODUCTION);
console.info("DB_URI: ", DB_URI);
console.info("PORT: ", PORT);
console.info("-----------------------\n\n");

const app = express();

const sequelize = new Sequelize(DB_URI, {...PRODUCTION && {
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true,
    },
  }
}});

const PingTests = sequelize.define('pingTest', {
  name: {
    type: DataTypes.STRING,
  },
});

app.all('/', (req, res) => {
  PingTests.findAll({ attributes: ['name'] }).then((tests) => {
    res.send(tests.length ? tests[0]['name'] : 'no tests');
  });
});

(async function () {
  await sequelize.authenticate();
  console.info("Db auth completed\n");
  app.listen(PORT, () => {
    console.info("Listening on port: " + PORT);
  });
})();
