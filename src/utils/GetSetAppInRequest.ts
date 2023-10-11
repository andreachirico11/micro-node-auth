import { Request } from 'express';
import { AppModel } from '../models/App';

const PROP_NAME = "foundApp";

export class GetSetAppInRequest {
    static getApp(req: Request) {
        return req[PROP_NAME] as  AppModel;
    }

    static setApp(req: Request, app: AppModel) {
        req[PROP_NAME] = app;
    }
}