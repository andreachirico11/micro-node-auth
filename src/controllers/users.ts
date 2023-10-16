import { RequestHandler } from 'express';
import { log_error, log_info } from '../utils/log';
import { ServerErrorResp, SuccessResponse } from '../types/ApiResponses';
import { INTERNAL_SERVER } from '../types/ErrorCodes';
import { UserModel } from '../models/User';
import { AddUserReq } from '../models/RequestTypes';
import { HashHelper } from '../configs/HashHelper';
import { isHashedFailed } from '../helpers/MIcroHashHelper';

export const addUser: RequestHandler = async ({ params: { appId }, body }: AddUserReq, res) => {
  try {
    const app_id = Number(appId);

    const { password, ...otherProps } = body;

    log_info('Call micro-node-crypt hashing service');
    const hashResp = await HashHelper.hashString(password);
    if (isHashedFailed(hashResp)) {
      throw new Error('Micro Hash Helper: ' + hashResp.errors[0]);
    }
    log_info('Password hashed successfully');

    log_info(otherProps, 'Creating new user with data: ');
    const { _id: user_id } = await UserModel.create({
      ...otherProps,
      app_id,
      password: hashResp.payload.hashResult,
    });
    log_info('User created with id: ' + user_id);

    return new SuccessResponse(res);
  } catch (e) {
    log_error(e, 'Error creating new user');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};
