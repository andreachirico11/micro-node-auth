import { getPing } from '../controllers/ping';
import { Router } from 'express';
import { unsupportedUrl } from '../controllers/unsuportedUrl';
import { addApp, checkIfAppExists } from '../controllers/apps';
import { checkAppPasswordRequirements, getRequestBodyValidator } from '../controllers/validators';
import { appValidator } from '../utils/validators/App';
import { userAuth, userValidator } from '../utils/validators/User';
import { addUser, authenticateUser, getUserByName, getUserToken, updateUserTokens } from '../controllers/users';

const router = Router();

router.post('/app', getRequestBodyValidator(appValidator), addApp);

router.post(
  '/user/:appId/auth',
  getRequestBodyValidator(userAuth),
  checkIfAppExists,
  getUserByName,
  authenticateUser,
  updateUserTokens,
  getUserToken
);

router.post(
  '/user/:appId',
  getRequestBodyValidator(userValidator),
  checkIfAppExists,
  checkAppPasswordRequirements,
  addUser
);


router.get('/ping', getPing);

router.use('*', unsupportedUrl);

export default router;
