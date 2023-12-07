import { IApp, IAppId } from "./App";
import { IAuthUser, IUser } from "./User";
import { Request } from 'express';

export type AppIdParams = {appId: string};

export type AddAppReq = Request<{}, {}, IApp>;

export type AddUserReq = Request<AppIdParams, {}, IUser>;

export type AuthRequest = Request<any, {}, IAuthUser>;

export type RequestWithAppIdInParams = Request<AppIdParams, {}, any>;

export type RequestWithAppIdInBody = Request<any, {}, IAppId>;
