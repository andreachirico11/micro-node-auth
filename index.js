if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const port = process.env.PORT || 3000;
const dbUri = process.env.DB_URI || '';

const express = require('express');
const app = express();

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(dbUri, {
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true,
    },
  },
});

const PingTests = sequelize.define('pingTest', {
  name: {
    type: DataTypes.STRING,
  },
});

app.all('/', (req, res) => {
  PingTests.findAll({ attributes: ['name'] }).then((tests) => {
    res.send(tests.length ? tests[0].name : 'no tests');
  });
});

sequelize.authenticate().then(() => {
  app.listen(port, () => {
    console.log(
      'version -------------> ' + (process.env.PRODUCTION === '1' ? 'PRODUCTION' : 'DEVELOPMENT')
    );
    console.log('listening on port: ' + port);
  });
});
