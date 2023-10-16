import { Response } from "node-fetch";
import { IApp } from "./App";
import { IUser } from "./User";
import { Request } from 'express';

export type AppIdParams = {appId: string};

export type AddAppReq = Request<{}, {}, IApp>;

export type AddUserReq = Request<AppIdParams, {}, IUser>;

export type RequestWithAppId = Request<AppIdParams, {}, any>;
