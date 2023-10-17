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
import { AddAppReq, RequestWithAppId } from '../models/RequestTypes';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';

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

export const checkIfAppExists: RequestHandler = async (req: RequestWithAppId, res, next) => {
  try {
    const {
      params: { appId },
    } = req;
    const _id = parseInt(appId);
    if (isNaN(_id)) {
      log_error('Error checking the app\n id param is not a valid number');
      return new ValidationErrResp(res);
    }

    log_info(`Check if App with id: ${appId} exists`);
    const existentApp = await AppModel.findOne({ where: { _id } });
    log_info('Success');

    if (!!!existentApp) {
      log_error("App doesn't exists");
      return new NotFoundResp(res, NON_EXISTENT);
    }

    GetSetRequestProps.setApp(req, existentApp);
    next();
  } catch (e) {
    log_error(e, 'Error checking');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};
