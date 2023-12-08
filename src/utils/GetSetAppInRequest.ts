import { Request } from 'express';
import { AppModel } from '../models/App';
import { UserModel } from '../models/User';
import { AdminModel } from '../models/Admin';

const APP = "foundApp", USER = "foundUser", ADMIN = "foundAdmin", CLIENT_IP = "client_ip";

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

    
    static getAdmin(req: Request) {
        return req[ADMIN] as  AdminModel;
    }

    static setAdmin(req: Request, u: AdminModel) {
        req[ADMIN] = u;
    }

    static getClientIp(req: Request) {
        return req[CLIENT_IP] as string;
    }

    static setClientIp(req: Request, ip: string) {
        req[CLIENT_IP] = ip;
    }
}