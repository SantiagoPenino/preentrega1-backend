import { Router } from "express";
import * as controller from "../controllers/products.controller.js";

const router = Router();

router.get("/filter", controller.filter);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);
router.post("/", controller.create);
router.get("/", controller.getAll);

export default router;
