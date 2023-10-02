import { getPing } from "./controllers/ping";
import { Router} from 'express';
import { unsupportedUrl } from "./controllers/unsuportedUrl";

const router = Router();

router.get("/ping", getPing);

router.use("*", unsupportedUrl);


export default router;
