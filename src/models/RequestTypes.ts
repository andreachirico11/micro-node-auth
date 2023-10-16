import { IApp } from "./App";
import { IAuthUser, IUser } from "./User";
import { Request } from 'express';

export type AppIdParams = {appId: string};

export type AddAppReq = Request<{}, {}, IApp>;

export type AddUserReq = Request<AppIdParams, {}, IUser>;

export type AuthenticateUserReq = Request<AppIdParams, {}, {
    username: string;
    password: string;
  }>;

export type ReqWithUsername = Request<any, {}, IAuthUser>;

export type RequestWithAppId = Request<AppIdParams, {}, any>;
