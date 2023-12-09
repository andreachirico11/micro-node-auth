import { getPing, pingExternalSevices } from '../controllers/ping';
import { Router } from 'express';
import { unsupportedUrl } from '../controllers/unsuportedUrl';
import { addApp, checkIfAppExistsFromBody, checkIfAppExistsFromParams, getAppIfApikeyIsValid } from '../controllers/apps';
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
import { addAdmin, areAdminActionsEnabled, authenticateAdmin, deleteAdmin, getAdminByName, getAdminToken, isAdminTokenValid, updateAdminToken } from '../controllers/admins';

const router = Router();

router.all('*', configRequest);

router.post('/app', isAdminTokenValid, getRequestBodyValidator(appCreation), addApp);

const authRouter = Router();

authRouter.post('/admin', getAdminByName, authenticateAdmin, updateAdminToken, getAdminToken);
authRouter.post(
  '/',
  getAppIfApikeyIsValid,
  getUserByNameAndApp,
  authenticateUser,
  updateUserTokens,
  getUserToken
);
router.use('/auth', getRequestBodyValidator(userAuth), authRouter);

const adminRouter = Router();
adminRouter.delete('/:adminId', deleteAdmin);
adminRouter.post('/', getRequestBodyValidator(adminCreation), addAdmin);
router.use('/admin', areAdminActionsEnabled, adminRouter);

router.post(
  '/user',
  getAppIfApikeyIsValid,
  getRequestBodyValidator(userCreation),
  checkAppPasswordRequirements,
  addUser
);

router.get('/ping/ext', pingExternalSevices);
router.get('/ping', getPing);

router.use('*', unsupportedUrl);

export default router;
