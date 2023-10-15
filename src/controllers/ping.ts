import { RequestHandler } from 'express';
import { PingTest } from '../models/PingTest';
import { log_error, log_info } from '../utils/log';
import { ServerErrorResp, SuccessResponse } from '../types/ApiResponses';
import { GENERIC } from '../types/ErrorCodes';

export const getPing: RequestHandler = async (req, res) => {
  try {
    log_info('Start Ping Test From Db');
    const { name } = await PingTest.findOne({ attributes: ['name'] });
    const logPhrase = 'Fetched the test with name: ' + name;
    log_info(logPhrase, 'Success!!!');
    return new SuccessResponse(res, logPhrase);
  } catch (error) {
    log_error(error, 'There was an error fetching tests');
    return new ServerErrorResp(res, GENERIC);
  }
};
