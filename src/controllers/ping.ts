import { RequestHandler } from 'express';
import { PingTest } from '../models/PingTest';
import { log_error, log_info } from '../utils/log';
import { ServerErrorResp, SuccessResponse } from '../types/ApiResponses';
import { GENERIC } from '../types/ErrorCodes';

export const getPing: RequestHandler = (req, res) => {
  console.log('Fetching from PingTest table');
  PingTest.findOne({ attributes: ['asdfas'] })
    .then(({name}) => {
      const logPhrase = 'Fetched the test with name: ' + name;
      log_info(logPhrase, "Success!!!");
      return new SuccessResponse(res, logPhrase);
    })
    .catch((err) => {
      log_error(err, 'There was an error fetching tests');
      return new ServerErrorResp(res, GENERIC);
    });
};
