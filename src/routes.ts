import { Router } from "express";
import { getPing } from "./controllers/ping";

const router = Router();


router.get("/ping", getPing);


export default router;