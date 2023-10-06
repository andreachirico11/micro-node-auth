import { Request, RequestHandler } from 'express';
import { log_error, log_info } from '../utils/log';
import { AppModel, IApp } from '../models/App';
import { ServerErrorResp, SuccessResponse } from '../types/ApiResponses';
import { INTERNAL_SERVER } from '../types/ErrorCodes';

type AddAppReq = Request<{}, {}, IApp>;

export const addApp: RequestHandler = async ({ body }: AddAppReq, res) => {
  try {
    log_info(body, 'Creating new app with data: ');
    await AppModel.create(body);
    return new SuccessResponse(res)
  } catch(e) {
    log_error(e, 'Error creating new app');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};
