import { getPing, pingExternalSevices } from '../controllers/ping';
import { Router } from 'express';
import { unsupportedUrl } from '../controllers/unsuportedUrl';
import {
  addApp,
  deleteApp,
  getAppById,
  getAppIfApikeyIsValid,
  updateApp,
} from '../controllers/apps';
import { checkAppPasswordRequirements, getRequestBodyValidator } from '../controllers/validators';
import { appCreation, appUpdate } from '../utils/validators/App';
import { userAuth, userCreation, userUpdate } from '../utils/validators/User';
import {
  addUser,
  authenticateUser,
  cascadeDeleteUsers,
  deleteUser,
  getAllUsers,
  returnUser,
  getUserByIdAndContinue,
  getUserByNameAndAppAndContinue,
  getUserToken,
  updateUser,
  updateUserTokens,
} from '../controllers/users';
import { configRequest } from '../controllers/utils';
import { adminCreation } from '../utils/validators/Admin';
import {
  addAdmin,
  areAdminActionsEnabled,
  authenticateAdmin,
  deleteAdmin,
  getAdminByName,
  getAdminToken,
  isAdminTokenValid,
  updateAdminToken,
} from '../controllers/admins';

const router = Router();

router.all('*', configRequest);

const appRouter = Router();
appRouter.post('/', getRequestBodyValidator(appCreation), addApp);
appRouter.put('/:appId', getAppById, getRequestBodyValidator(appUpdate), updateApp);
appRouter.delete('/:appId', getAppById, cascadeDeleteUsers, deleteApp);
router.use('/app', isAdminTokenValid, appRouter);

const authRouter = Router();
authRouter.post('/admin', getAdminByName, authenticateAdmin, updateAdminToken, getAdminToken);
authRouter.post(
  '/',
  getAppIfApikeyIsValid,
  getUserByNameAndAppAndContinue,
  authenticateUser,
  updateUserTokens,
  getUserToken
);
router.use('/auth', getRequestBodyValidator(userAuth), authRouter);

const adminRouter = Router();
adminRouter.delete('/:adminId', deleteAdmin);
adminRouter.post('/', getRequestBodyValidator(adminCreation), addAdmin);
router.use('/admin', areAdminActionsEnabled, adminRouter);

const userRouter = Router();
userRouter.get('/:userId', getUserByIdAndContinue, returnUser);
userRouter.get('/', getAllUsers);
userRouter.post('/', getRequestBodyValidator(userCreation), checkAppPasswordRequirements, addUser);
userRouter.put(
  '/:userId',
  getRequestBodyValidator(userUpdate),
  getUserByIdAndContinue,
  checkAppPasswordRequirements,
  updateUser
);
userRouter.delete('/:userId', getUserByIdAndContinue, deleteUser);
router.use('/user', getAppIfApikeyIsValid, userRouter);

router.get('/ping/ext', pingExternalSevices);
router.get('/ping', getPing);

router.use('*', unsupportedUrl);

export default router;
