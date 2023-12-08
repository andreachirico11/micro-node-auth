import { RequestHandler } from 'express';
import { log_error, log_info } from '../utils/log';
import {
  NotFoundResp,
  ServerErrorResp,
  SuccessResponse,
  SuccessResponseWithTokens,
  UnauthorizedResp,
} from '../types/ApiResponses';
import { INTERNAL_SERVER, NON_EXISTENT } from '../types/ErrorCodes';
import { UserModel } from '../models/User';
import { AddUserReq, AuthRequest } from '../models/RequestTypes';
import { HashHelper } from '../configs/HashHelper';
import { isHashErrorResponse } from '../helpers/MIcroHashHelper';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';
import { getActualDateWithAddedHours } from '../utils/dates';
import { NodeTlsHandler } from '../configs/Envs';
import callMicroHash from '../utils/callMicroHash';

export const addUser: RequestHandler = async ({ params: { appId }, body }: AddUserReq, res) => {
  try {
    const app_id = Number(appId);

    const { password, ...otherProps } = body;

    NodeTlsHandler.disableTls();
    log_info('Call micro-node-crypt hashing service');
    const hashedPsw = await callMicroHash(password);
    log_info('Password hashed successfully');

    log_info(otherProps, 'Creating new user with data: ');
    const { _id: user_id } = await UserModel.create({
      ...otherProps,
      app_id,
      password: hashedPsw,
      dateAdd: new Date(),
      datePasswordChange: new Date()
    });
    log_info('User created with id: ' + user_id);

    return new SuccessResponse(res);
  } catch (e) {
    log_error(e, 'Error creating new user');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  } finally {
    NodeTlsHandler.enableTls();
  }
};


export const authenticateUser: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const app = GetSetRequestProps.getApp(req),
      user = GetSetRequestProps.getUser(req),
      { username, password } = req.body;
    log_info(
      `Starting authentication process for username < ${username} > to application < ${app.name} >`
    );

    NodeTlsHandler.disableTls();
    const comparisonResult = await HashHelper.compareString(user.password, password);

    if (isHashErrorResponse(comparisonResult)) {
      throw new Error('Micro Hash Helper: ' + comparisonResult.errors[0]);
    }

    if (comparisonResult.payload.compareResult) {
      log_info('Password matches, proceding to update user token');
      return next();
    }

    log_info('Password does not match');
    return new UnauthorizedResp(res);
  } catch (e) {
    log_error(e, 'Authentication Error');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  } finally {
    NodeTlsHandler.enableTls();
  }
};

export const getUserByNameAndApp: RequestHandler = async (req: AuthRequest, res, next) => {
  try {
    const {
      body: { username },
    } = req;
    log_info(`Getting User ` + username);
    const {_id} = GetSetRequestProps.getApp(req);
    const foundUser = await UserModel.findOne({ where: { name: username, app_id:  _id} });
    log_info('Success');

    if (!!!foundUser) {
      log_error("User doesn't exists");
      return new NotFoundResp(res, NON_EXISTENT);
    }

    GetSetRequestProps.setUser(req, foundUser);
    next();
  } catch (e) {
    log_error(e, 'Error Getting User');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const updateUserTokens: RequestHandler = async (req, res, next) => {
  try {
    const user = GetSetRequestProps.getUser(req), {tokenHoursValidity} = GetSetRequestProps.getApp(req);
    log_info(`Updating token for the user ${user.name}`);

    log_info('Call micro-node-crypt hashing service');    

    user.authToken = await callMicroHash(user.name);
    user.dateTokenExp = getActualDateWithAddedHours(tokenHoursValidity);
    log_info('Auth Token Generated');    

    user.refreshToken = await callMicroHash(user.password);
    user.dateRefTokenExp = getActualDateWithAddedHours(tokenHoursValidity * 10);
    log_info('Refresh Token Generated');

    await user.save();

    next();
  } catch (e) {
    log_error(e, 'Error updating user with new tokens');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const getUserToken: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const {name, authToken, dateTokenExp, refreshToken} = GetSetRequestProps.getUser(req);
    log_info(`Returning ${name} tokens`);
    return new SuccessResponseWithTokens(res, {authToken, refreshToken, dateTokenExp});
  } catch (e) {
    log_error(e, 'Error Getting User');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};