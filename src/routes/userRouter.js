import { Router } from "express";
import * as controller from "../controllers/user.controller.js";

const router = Router();

router.post("/register", controller.create);
router.post("/login", controller.login);

export default router;
