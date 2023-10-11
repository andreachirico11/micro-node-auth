
import { PORT } from './utils/Envs';
import { log_error, log_fatal, log_info } from './utils/log';
import initSequelize from './configs/sequelize';
import express from './configs/express';
import { Application } from 'express';

(async function () {

  let app: Application;

  try {
    app = express();
  } catch(e) {
    log_error(e, 'Error Configuring Express');
  }

  try {
    await initSequelize();
    log_info('Connected to Db');
  } catch (e) {
    log_error(e, 'Error with Database Connection');
  }

  app.listen(PORT, () => {
    log_info('Listening on port: ' + PORT);
  }).on("error", () => {
    log_fatal("App listen Crashed")
  });

})();
