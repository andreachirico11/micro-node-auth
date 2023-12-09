import { IAdmin } from "./Admin";
import { IApp, IAppId } from "./App";
import { IAuthUser, IUser } from "./User";
import { Request } from 'express';

export type AppIdParams = {appId: string};

export type AdminIdParams = {adminId: string};

export interface RequestWithTokenHeader<TParams, Tbody, Tbody2> extends Request<TParams, Tbody, Tbody2> {
    headers:  {admintoken: string}
};

export interface RequestWithApikeyHeader<TParams, Tbody, Tbody2> extends Request<TParams, Tbody, Tbody2> {
    headers:  {api_key: string}
};

export type AddAppReq = RequestWithTokenHeader<{}, {}, IApp>;

export type AddUserReq = RequestWithApikeyHeader<{}, {}, IUser>;

export type AddAdminReq = Request<{}, {}, IAdmin>;

export type DeleteAdminReq = Request<AdminIdParams, {}, {}>;

export type AuthRequest = RequestWithApikeyHeader<{}, {}, IAuthUser>;

export type RequestWithAppIdInParams = Request<AppIdParams, {}, any>;

export type RequestWithAppIdInBody = Request<any, {}, IAppId>;
