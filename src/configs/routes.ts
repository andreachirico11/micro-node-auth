import { getPing } from "../controllers/ping";
import { Router} from 'express';
import { unsupportedUrl } from "../controllers/unsuportedUrl";
import { addApp } from "../controllers/apps";
import { getRequestBodyValidator } from "../controllers/validators";
import { appValidator } from "../validators/App";
import { userValidator } from "../validators/User";
import { addUser } from "../controllers/users";

const router = Router();

router.post("/app", getRequestBodyValidator(appValidator), addApp)

router.post("/user/:appId", getRequestBodyValidator(userValidator), addUser)

router.get("/ping", getPing);

router.use("*", unsupportedUrl);


export default router;
