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


export type AddAppReqBody = Omit<IApp ,"_id"| "apiKey" | "dateAdd">;

export type UpdateAppReqBody = Omit<AddAppReqBody ,"passwordLenght" | "uppercaseLetters" | "symbols" | "numbers" | "symbolsRegex">;


// requests
export type RequestWithAppIdParams = Request<AppIdParams, {}, any>;

export type AddAppReq = RequestWithTokenHeader<{}, {}, AddAppReqBody>;

export type UpdateAppReq = RequestWithTokenHeader<AppIdParams, {}, UpdateAppReqBody>;

export type DeleteAppReq = RequestWithTokenHeader<AppIdParams, {}, {}>;

export type AddUserReq = RequestWithApikeyHeader<{}, {}, IUser>;

export type AddAdminReq = Request<{}, {}, IAdmin>;

export type DeleteAdminReq = Request<AdminIdParams, {}, {}>;

export type AuthRequest = RequestWithApikeyHeader<{}, {}, IAuthUser>;

export type RequestWithAppIdInParams = Request<AppIdParams, {}, any>;

export type RequestWithAppIdInBody = Request<any, {}, IAppId>;
