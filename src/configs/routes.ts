import { getPing, pingExternalSevices } from '../controllers/ping';
import { Router } from 'express';
import { unsupportedUrl } from '../controllers/unsuportedUrl';
import { addApp, checkIfAppExists } from '../controllers/apps';
import { checkAppPasswordRequirements, getRequestBodyValidator } from '../controllers/validators';
import { appCreation } from '../utils/validators/App';
import { userAuth, userCreation } from '../utils/validators/User';
import { addUser, authenticateUser, getUserByNameAndApp, getUserToken, updateUserTokens } from '../controllers/users';

const router = Router();

router.post('/app', getRequestBodyValidator(appCreation), addApp);

router.post(
  '/user/:appId/auth',
  getRequestBodyValidator(userAuth),
  checkIfAppExists,
  getUserByNameAndApp,
  authenticateUser,
  updateUserTokens,
  getUserToken
);

router.post(
  '/user/:appId',
  getRequestBodyValidator(userCreation),
  checkIfAppExists,
  checkAppPasswordRequirements,
  addUser
);

router.get('/ping/ext', pingExternalSevices);
router.get('/ping', getPing);

router.use('*', unsupportedUrl);

export default router;
