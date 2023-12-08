import { IAdmin } from "./Admin";
import { IApp, IAppId } from "./App";
import { IAuthUser, IUser } from "./User";
import { Request } from 'express';

export type AppIdParams = {appId: string};

export type AdminIdParams = {adminId: string};

export interface RequestWithTokenHeader<TParams, Tbody, Tbody2> extends Request<TParams, Tbody, Tbody2> {
    headers:  {admintoken: string}
};

export type AddAppReq = RequestWithTokenHeader<{}, {}, IApp>;

export type AddUserReq = Request<AppIdParams, {}, IUser>;

export type AddAdminReq = Request<{}, {}, IAdmin>;

export type DeleteAdminReq = Request<AdminIdParams, {}, {}>;

export type AuthRequest = Request<any, {}, IAuthUser>;

export type RequestWithAppIdInParams = Request<AppIdParams, {}, any>;

export type RequestWithAppIdInBody = Request<any, {}, IAppId>;
