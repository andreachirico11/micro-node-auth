import { Request, RequestHandler } from 'express';
import { log_error, log_info } from '../utils/log';
import { ServerErrorResp, SuccessResponse } from '../types/ApiResponses';
import { INTERNAL_SERVER } from '../types/ErrorCodes';
import { IUser, UserModel } from '../models/User';
import { RequestWithAppId } from './apps';


type AddUserReq = RequestWithAppId & Request<{appId: string}, {}, IUser>;

export const addUser: RequestHandler = async ({ params: {appId}, body }: AddUserReq, res) => {
  try {
    const app_id = Number(appId);

    log_info(body, 'Creating new user with data: ');
    const {_id: user_id} = await UserModel.create({...body, app_id});
    log_info('User created with id: ' + user_id);

    return new SuccessResponse(res)
  } catch(e) {
    log_error(e, 'Error creating new user');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};
