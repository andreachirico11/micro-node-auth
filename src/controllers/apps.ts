import { NextFunction, RequestHandler } from 'express';
import { log_error, log_info } from '../utils/log';
import { AppModel } from '../models/App';
import {
  NotFoundResp,
  ServerErrorResp,
  SuccessResponse,
  UnauthorizedResp,
  ValidationErrResp,
} from '../types/ApiResponses';
import { INTERNAL_SERVER, MISSING_PARAM, NON_EXISTENT, UNAUTHORIZED } from '../types/ErrorCodes';
import {
  AddAppReq,
  RequestWithApikeyHeader,
  RequestWithAppIdInBody,
  RequestWithAppIdInParams,
  UpdateAppReq,
} from '../models/RequestTypes';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';
import { Response } from 'express';
import { isHashErrorResponse } from '../helpers/MIcroHashHelper';
import { HashHelper } from '../configs/HashHelper';

export const addApp: RequestHandler = async ({ body }: AddAppReq, res) => {
  try {
    log_info(body, 'Creating new app with data: ');
    log_info('Calling external service to get a new api key');
    const keyResponse = await HashHelper.getNewApiKey();
    if (isHashErrorResponse(keyResponse)) {
      throw new Error("Micro Hash Helper can't provide a valid api key");
    }
    const {
      payload: { key: apiKey },
    } = keyResponse;
    log_info('Key Generated: ' + apiKey);
    await AppModel.create({ ...body, dateAdd: new Date(), apiKey });
    log_info('Success');
    return new SuccessResponse(res);
  } catch (e) {
    log_error(e, 'Error creating new app');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const updateApp: RequestHandler = async ({params: {appId}, body }: UpdateAppReq, res) => {
  try {
    log_info('Updating new app with id: ' + appId);
    const appToUpdate = await AppModel.findByPk(appId);
    if (!!!appToUpdate) {
      log_error("No app found")
      return new NotFoundResp(res, NON_EXISTENT);
    }
    appToUpdate.update({...body});
    log_info('App updated');
    return new SuccessResponse(res);
  } catch (e) {
    log_error(e, 'Error updating new app');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const getAppIfApikeyIsValid: RequestHandler = async (
  req: RequestWithApikeyHeader<any, any, any>,
  res,
  next
) => {
  try {
    const {
      headers: { api_key: apiKey },
    } = req;
    if (!!!apiKey) {
      log_error('The key is missing');
      return new UnauthorizedResp(res, 'The key is missing');
    }
    const linkedApp = await AppModel.findOne({ where: { apiKey } });
    if (!!!linkedApp) {
      log_error('No app is associated with this api key');
      return new NotFoundResp(res, NON_EXISTENT);
    }
    log_info('Found app with name << ' + linkedApp.name + ' >>');
    GetSetRequestProps.setApp(req, linkedApp);
    next();
  } catch (e) {
    log_error(e, 'Error using api key');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const checkIfAppExistsFromParams: RequestHandler = async (
  req: RequestWithAppIdInParams,
  res,
  next
) => {
  const {
    params: { appId },
  } = req;
  return checkIfAppExist(parseInt(appId), req, res, next);
};

export const checkIfAppExistsFromBody: RequestHandler = async (
  req: RequestWithAppIdInBody,
  res,
  next
) => {
  let {
    body: { appId },
  } = req;
  return checkIfAppExist(appId, req, res, next);
};

const checkIfAppExist = async (
  _id: number | string,
  req: RequestWithAppIdInBody | RequestWithAppIdInParams,
  res: Response,
  next: NextFunction
) => {
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
