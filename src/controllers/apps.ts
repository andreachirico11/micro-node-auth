import { Request, RequestHandler } from 'express';
import { log_error, log_info } from '../utils/log';
import { AppModel, IApp } from '../models/App';
import {
  NotFoundResp,
  ServerErrorResp,
  SuccessResponse,
  ValidationErrResp,
} from '../types/ApiResponses';
import { INTERNAL_SERVER, NON_EXISTENT } from '../types/ErrorCodes';
import { UserModel } from '../models/User';

type AddAppReq = Request<{}, {}, IApp>;

export const addApp: RequestHandler = async ({ body }: AddAppReq, res) => {
  try {
    log_info(body, 'Creating new app with data: ');
    await AppModel.create(body);
    log_info('Success');
    return new SuccessResponse(res);
  } catch (e) {
    log_error(e, 'Error creating new app');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export type RequestWithAppId = Request<{ appId: string }, {}, any>;

export const checkIfAppExists: RequestHandler = async (
  { params: { appId } }: RequestWithAppId,
  res,
  next
) => {
  try {
    const _id = parseInt(appId);
    if (isNaN(_id)) {
      log_error('Error checking the app\n id param is not a valid number');
      return new ValidationErrResp(res);
    }

    log_info(`Check if App with id: ${appId} exists`);
    const appExists = (await AppModel.count({ where: { _id } })) === 1;
    log_info('Success');

    if (!appExists) {
      log_error('App doesn\'t exists');
      return new NotFoundResp(res, NON_EXISTENT);
    }

    next();
  } catch (e) {
    log_error(e, 'Error checking');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};
