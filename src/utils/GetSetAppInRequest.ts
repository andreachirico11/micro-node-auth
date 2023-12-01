import { Request } from 'express';
import { AppModel } from '../models/App';
import { UserModel } from '../models/User';

const APP = "foundApp", USER = "foundUser", CLIENT_IP = "client_ip";

export class GetSetRequestProps {
    static getApp(req: Request) {
        return req[APP] as  AppModel;
    }

    static setApp(req: Request, app: AppModel) {
        req[APP] = app;
    }

    static getUser(req: Request) {
        return req[USER] as  UserModel;
    }

    static setUser(req: Request, u: UserModel) {
        req[USER] = u;
    }

    static getClientIp(req: Request) {
        return req[CLIENT_IP] as string;
    }

    static setClientIp(req: Request, ip: string) {
        req[CLIENT_IP] = ip;
    }
}