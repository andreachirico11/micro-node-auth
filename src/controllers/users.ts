import { RequestHandler } from 'express';
import { log_error, log_info } from '../utils/log';
import {
  NotFoundResp,
  ServerErrorResp,
  SuccessResponse, UnauthorizedResp
} from '../types/ApiResponses';
import { INTERNAL_SERVER, NON_EXISTENT } from '../types/ErrorCodes';
import { UserModel } from '../models/User';
import { AddUserReq, AuthCheckRequest, AuthRequest, DeleteAppReq, HeaderApiKey, RequestWithCustomHeader, RequestWithUserIdInParams } from '../models/RequestTypes';
import { HashHelper } from '../configs/HashHelper';
import { isHashErrorResponse } from '../helpers/MIcroHashHelper';
import { GetSetRequestProps } from '../utils/GetSetAppInRequest';
import { getActualDateWithAddedHours, isDateInThePast } from '../utils/dates';
import { NodeTlsHandler } from '../configs/Envs';
import callMicroHash from '../utils/callMicroHash';
import unbearerTokenString from '../utils/unbearerTokenString';


const generateTokenAndExp = async (baseString: string, hoursValidity: number): Promise<[string, Date]> => {
  return [await callMicroHash(baseString), getActualDateWithAddedHours(hoursValidity)];
}

export const getAllUsers: RequestHandler = async (req: RequestWithCustomHeader<any, any, any, HeaderApiKey>, res) => {
  try {
    const {_id: app_id} = GetSetRequestProps.getApp(req);
    log_info("Retrieving all users for app with id: " + app_id);
    const users = await UserModel.findAll({where: {app_id}});
    log_info("Number of users found: " + users.length);
    return new SuccessResponse(res, {users});
  } catch (e) {
    log_error(e, 'Error creating new user');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  } 
};

export const getUserByNameAndAppAndContinue: RequestHandler = async (req: AuthRequest, res, next) => {
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

export const getUserByIdAndContinue: RequestHandler = async (req: RequestWithUserIdInParams, res, next) => {
  try {
    const {params: {userId}} = req;
    log_info(`Getting User with id: ` + userId);
    const foundUser = await UserModel.findByPk(userId);
    if (!!!foundUser) {
      log_error("User doesn't exists");
      return new NotFoundResp(res, NON_EXISTENT);
    }
    log_info("User Found");
    GetSetRequestProps.setUser(req, foundUser);
    next();
  } catch (e) {
    log_error(e, 'Error Getting User');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const returnUser: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const user = GetSetRequestProps.getUser(req);
    log_info(`Returning ${user.name} tokens`);
    return new SuccessResponse(res, {user});
  } catch (e) {
    log_error(e, 'Error Getting User');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const getUserToken: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const {name, authToken, dateTokenExp, refreshToken, dateRefTokenExp} = GetSetRequestProps.getUser(req), {refreshToken: appHasRefToken} = GetSetRequestProps.getApp(req);;
    log_info(`Returning ${name} tokens`);
    return new SuccessResponse(res, {authToken, dateTokenExp, ...appHasRefToken && {refreshToken, dateRefTokenExp}});
  } catch (e) {
    log_error(e, 'Error Getting User');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const addUser: RequestHandler = async (req: AddUserReq, res) => {
  try {
    const { password, ...otherProps } = req.body;
    const {_id: app_id} = GetSetRequestProps.getApp(req);

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

export const updateUser: RequestHandler = async (req: AddUserReq, res) => {
  try {
    const { password, name } = req.body;
    const userToBeUpdated = GetSetRequestProps.getUser(req);
    if (!!name) userToBeUpdated.name = name;
    if (!!password) {
      NodeTlsHandler.disableTls();
      log_info('Call micro-node-crypt hashing service to update password');
      userToBeUpdated.password = await callMicroHash(password);
      log_info('Password hashed successfully');
      userToBeUpdated.datePasswordChange = new Date();
      userToBeUpdated.resetToken = null;
      userToBeUpdated.refreshToken = null;
      userToBeUpdated.authToken = null;
      userToBeUpdated.dateTokenExp = null;
      userToBeUpdated.dateRefTokenExp = null;
    }

    await userToBeUpdated.save();
    log_info('User  with id <<' + userToBeUpdated._id + '>> updated');
    return new SuccessResponse(res);
  } catch (e) {
    log_error(e, 'Error creating new user');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  } finally {
    NodeTlsHandler.enableTls();
  }
};

export const deleteUser: RequestHandler = async (req: AddUserReq, res) => {
  try {
    const userToDelete = GetSetRequestProps.getUser(req);
    log_info("Deleting user with id: " + userToDelete._id);
    await userToDelete.destroy();
    log_info("Deleted");
    return new SuccessResponse(res);
  } catch (e) {
    log_error(e, 'Error creating new user');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  } 
};


export const cascadeDeleteUsers: RequestHandler = async (req: DeleteAppReq, res, next) => {
  try {
    const {params: {appId: app_id}} = req;
    log_info("Deleting all user for the app with id: " + app_id);
    const numOfDeleted = await UserModel.destroy({where: {app_id}});
    log_info("Deleted " + numOfDeleted + " users");
    next();
  } catch (e) {
    log_error(e, 'Error updating user with new tokens');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const checkAuthToken: RequestHandler = async (req: AuthCheckRequest, res, next) => {
  try {
    const {_id: app_id} = GetSetRequestProps.getApp(req), {headers: {authorization: authToken}} = req;
    log_info(`Check if token << ${authToken} >> exists and is still valid`);
    const foundUser = await UserModel.findOne({where: {authToken, app_id}});
    if (!!!foundUser) {
      log_error("No user for this token");
      return new UnauthorizedResp(res, "Invalid token");
    }
    if (isDateInThePast(foundUser.dateTokenExp)) {
      log_error("Token has expired");
      return new UnauthorizedResp(res, "Token is not valid anymore");
    }
    log_info("The token is still valid", `Found User With Name << ${foundUser.name} >>`);
    return new SuccessResponse(res);
  } catch (e) {
    log_error(e, 'Authentication Error');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const onRefreshAuthToken: RequestHandler = async (req: AuthCheckRequest, res, next) => {
  try {
    const {_id: app_id, refreshToken: isFeatureActivated} = GetSetRequestProps.getApp(req), {headers: {authorization: refreshToken}} = req;
    if (!isFeatureActivated) {
      const phrase ="The refresh feature is not activated on this app";
      log_error(phrase);
      return new UnauthorizedResp(res, phrase);
    }
    log_info(`Check if user with refresh token << ${refreshToken} >> exists`);
    const foundUser = await UserModel.findOne({where: {refreshToken, app_id}});
    if (!!!foundUser) {
      log_error("No user for this token");
      return new UnauthorizedResp(res, "Invalid token");
    }
    const tokenExpDate = new Date(foundUser.dateRefTokenExp);
    if (isDateInThePast(tokenExpDate)) {
      log_error("Refresh Token has expired");
      return new UnauthorizedResp(res, "Refresh Token is not valid anymore");
    }
    log_info("The refresh token is still valid", `Found User With Name << ${foundUser.name} >>`);
    GetSetRequestProps.setUser(req, foundUser);
    GetSetRequestProps.setetSkipRefTkUpdate(req, true);
    next();
  } catch (e) {
    log_error(e, 'Authentication Error');
    return new ServerErrorResp(res, INTERNAL_SERVER);
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

export const updateUserTokens: RequestHandler = async (req, res, next) => {
  try {
    const user = GetSetRequestProps.getUser(req), {tokenHoursValidity, 
      refreshToken: appHasRefToken} = GetSetRequestProps.getApp(req), 
      skipRefTkUpdate = GetSetRequestProps.getSkipRefTkUpdate(req),
      updateRefreshToken = !skipRefTkUpdate && appHasRefToken;
    log_info(`Updating token for the user ${user.name}`);
    NodeTlsHandler.disableTls();
    log_info('Call micro-node-crypt hashing service');
    const [authToken, dateTokenExp] = await generateTokenAndExp(user.name, tokenHoursValidity);
    const [refreshToken, dateRefTokenExp] = updateRefreshToken ?  await generateTokenAndExp(user.name, tokenHoursValidity + 24) : [];
    await user.update({authToken, dateTokenExp, ...updateRefreshToken && {refreshToken, dateRefTokenExp}});
    next();
  } catch (e) {
    log_error(e, 'Error updating user with new tokens');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  } finally {
    NodeTlsHandler.enableTls();
  }
};