import { getPing, pingExternalSevices } from '../controllers/ping';
import { Router } from 'express';
import { unsupportedUrl } from '../controllers/unsuportedUrl';
import { addApp, checkIfAppExistsFromBody, checkIfAppExistsFromParams } from '../controllers/apps';
import { checkAppPasswordRequirements, getRequestBodyValidator } from '../controllers/validators';
import { appCreation } from '../utils/validators/App';
import { userAuth, userCreation } from '../utils/validators/User';
import {
  addUser,
  authenticateUser,
  getUserByNameAndApp,
  getUserToken,
  updateUserTokens,
} from '../controllers/users';
import { configRequest } from '../controllers/utils';
import { adminCreation } from '../utils/validators/Admin';
import { addAdmin, areAdminActionsEnabled, deleteAdmin } from '../controllers/admins';

const router = Router();

router.all('*', configRequest);

router.post('/app', getRequestBodyValidator(appCreation), addApp);

router.post(
  '/auth',
  getRequestBodyValidator(userAuth),
  checkIfAppExistsFromBody,
  getUserByNameAndApp,
  authenticateUser,
  updateUserTokens,
  getUserToken
);

const adminRouter = Router();
adminRouter.delete('/:adminId', deleteAdmin);
adminRouter.post('/', getRequestBodyValidator(adminCreation), addAdmin);
router.use('/admin', areAdminActionsEnabled, adminRouter)


router.post(
  '/user/:appId',
  getRequestBodyValidator(userCreation),
  checkIfAppExistsFromParams,
  checkAppPasswordRequirements,
  addUser
);

router.get('/ping/ext', pingExternalSevices);
router.get('/ping', getPing);

router.use('*', unsupportedUrl);

export default router;
