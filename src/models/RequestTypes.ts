import { IncomingHttpHeaders } from "http";
import { IAdmin } from "./Admin";
import { IApp, IAppId } from "./App";
import { IAuthUser } from "./User";
import { Request } from 'express';

export type AppIdParams = {appId: string};
export type AdminIdParams = {adminId: string};
export type UserIdParams = {userId: string};

export type HeaderAdminToken =  {admintoken: string};
export type HeaderApiKey =  {api_key: string};
export type HeaderAuthorization =  {authorization: string};

export type AddAppReqBody = Omit<IApp ,"_id"| "apiKey" | "dateAdd">;
export type UpdateAppReqBody = Omit<AddAppReqBody ,"passwordLenght" | "uppercaseLetters" | "symbols" | "numbers" | "symbolsRegex">;
export type AddUserReqBody = {
    name: string;
    password: string;
}
export type UpdateUserReqBody = {
    name?: string;
    password?: string;
}

export interface RequestWithCustomHeader<TParams, Tbody, Tbody2, THeader extends IncomingHttpHeaders> extends Request<TParams, Tbody, Tbody2> {
    headers: THeader
}

// requests
export type RequestWithAppIdParams = Request<AppIdParams, {}, any>;

export type RequestWithAppIdInParams = Request<AppIdParams, {}, any>;

export type RequestWithUserIdInParams = Request<UserIdParams, {}, any>;

export type RequestWithAppIdInBody = Request<any, {}, IAppId>;

export type AddAppReq = RequestWithCustomHeader<{}, {}, AddAppReqBody, HeaderAdminToken>;

export type UpdateAppReq = RequestWithCustomHeader<AppIdParams, {}, UpdateAppReqBody,HeaderAdminToken>;

export type DeleteAppReq = RequestWithCustomHeader<AppIdParams, {}, {}, HeaderAdminToken>;

export type GetUserReq = RequestWithCustomHeader<UserIdParams, {}, {}, HeaderApiKey>;

export type AddUserReq = RequestWithCustomHeader<{}, {}, AddUserReqBody, HeaderApiKey>;

export type UpdateUserReq = RequestWithCustomHeader<{}, {}, UpdateUserReqBody, HeaderApiKey>;

export type AuthRequest = RequestWithCustomHeader<{}, {}, IAuthUser, HeaderApiKey>;

export type AuthCheckRequest = RequestWithCustomHeader<{}, {}, IAuthUser, HeaderApiKey & HeaderAuthorization>;

export type AddAdminReq = Request<{}, {}, IAdmin>;

export type DeleteAdminReq = Request<AdminIdParams, {}, {}>;

