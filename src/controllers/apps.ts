import { NextFunction, RequestHandler } from 'express';
import { log_error, log_info } from '../utils/log';
import { AppModel } from '../models/App';
import {
  NotFoundResp,
  ServerErrorResp,
  SuccessResponse,
  ValidationErrResp,
} from '../types/ApiResponses';
import { INTERNAL_SERVER, NON_EXISTENT } from '../types/ErrorCodes';
import { AddAppReq, RequestWithAppIdInBody, RequestWithAppIdInParams } from '../models/RequestTypes';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';
import { Response } from 'express';

export const addApp: RequestHandler = async ({ body }: AddAppReq, res) => {
  try {
    log_info(body, 'Creating new app with data: ');
    await AppModel.create({...body, dateAdd: new Date()});
    log_info('Success');
    return new SuccessResponse(res);
  } catch (e) {
    log_error(e, 'Error creating new app');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const checkIfAppExistsFromParams: RequestHandler = async (req: RequestWithAppIdInParams, res, next) => {
  const {
    params: { appId },
  } = req;
  return checkIfAppExist(parseInt(appId), req, res, next);
};

export const checkIfAppExistsFromBody: RequestHandler = async (req: RequestWithAppIdInBody, res, next) => {
  let {
    body: { appId },
  } = req;
  return checkIfAppExist(appId, req, res, next);
};

const checkIfAppExist = async (_id: number | string, req: RequestWithAppIdInBody | RequestWithAppIdInParams, res: Response, next: NextFunction) => {
  try {
  if (typeof _id === 'string') _id = parseInt(_id);
    if (isNaN(_id)) {
      log_error('The app id is not a valid number');
      return new ValidationErrResp(res);
    }

    log_info(`Check if App with id: ${_id} exists`);
    const existentApp = await AppModel.findOne({ where: { _id } });
    if (!!!existentApp) {
      log_error("App doesn't exists");
      return new NotFoundResp(res, NON_EXISTENT);
    }
    log_info('Success');

    GetSetRequestProps.setApp(req, existentApp);
    next();
  } catch (e) {
    log_error(e, 'Error checking');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};