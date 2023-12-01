import { RequestHandler } from 'express';
import { PingTest } from '../models/PingTest';
import { log_error, log_info } from '../utils/log';
import { ServerErrorResp, SeviceUnavailable, SuccessResponse } from '../types/ApiResponses';
import { GENERIC, NO_RESPONSE } from '../types/ErrorCodes';
import { HashHelper } from '../configs/HashHelper';

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


export const pingExternalSevices: RequestHandler = async (req, res) => {
  try {
    log_info('Start Ping Test From Micro Node Crypt');
    if (await HashHelper.ping()) {
      const logPhrase = "Micro Crypt Connected";
      log_info(logPhrase, 'Success!!!');
      return new SuccessResponse(res, logPhrase);
    } 
    throw new Error();
  } catch (e) {
    log_error(e, 'Error Calling Micro Crypt');
    return new SeviceUnavailable(res, NO_RESPONSE);
  }
};
