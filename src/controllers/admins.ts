import { RequestHandler } from 'express';
import { ADMIN_CRUDS, NodeTlsHandler } from '../configs/Envs';
import { AddAdminReq, DeleteAdminReq } from '../models/RequestTypes';
import { SuccessResponse, ServerErrorResp, NotFoundResp, UnauthorizedResp } from '../types/ApiResponses';
import { INTERNAL_SERVER, NON_EXISTENT } from '../types/ErrorCodes';
import { log_info, log_error } from '../utils/log';
import { AdminModel } from '../models/Admin';
import callMicroHash from '../utils/callMicroHash';

export const addAdmin: RequestHandler = async ({ body }: AddAdminReq, res) => {
  try {
    const { password, username } = body;

    NodeTlsHandler.disableTls();
    log_info('Call micro-node-crypt hashing service');
    const hashedPsw = await callMicroHash(password);
    log_info('Password hashed successfully');

    log_info(username, 'Creating new admin with name: ');
    const { _id: admin_id } = await AdminModel.create({
      username,
      password: hashedPsw,
    });
    log_info('Admin created with id: ' + admin_id);

    return new SuccessResponse(res);
  } catch (e) {
    log_error(e, 'Error creating new admin');
    return new ServerErrorResp(res, INTERNAL_SERVER);
  } finally {
    NodeTlsHandler.enableTls();
  }
};

export const deleteAdmin: RequestHandler = async (
  { params: { adminId: _id } }: DeleteAdminReq,
  res
) => {
  try {
    log_info(addAdmin, 'Creating new admin with data: ');
    const adminToDelete = await AdminModel.findOne({ where: { _id } });
    if (!!!adminToDelete) {
      log_error("This Admin doesn't exists");
      return new NotFoundResp(res, NON_EXISTENT);
    }
    await adminToDelete.destroy();
    return new SuccessResponse(res);
  } catch (e) {
    log_error(e, 'Error deleting admin with id: ' + _id);
    return new ServerErrorResp(res, INTERNAL_SERVER);
  }
};

export const areAdminActionsEnabled: RequestHandler = async (
  _,
  res, next
) => {
  const base = "Admin cruds are ";
  if (ADMIN_CRUDS) {
    log_info(base + "allowed");
    return next();
  }
  return new UnauthorizedResp(res, base + "deactivated");
};
