import { Request, RequestHandler } from 'express';
import { log_info } from '../utils/log';
import { App } from '../models/App';

type AddAppReq = Request<{}, {}, App>;

export const addApp: RequestHandler = ({ body }: AddAppReq, res) => {
  log_info(body, 'Creating new app with data: ');

  res.send('ok');
};
