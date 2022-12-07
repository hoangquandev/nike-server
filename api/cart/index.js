import { Router } from "express";
import { create, index, show, remove, update } from "./controller";
import auth from "../../middleware/auth/auth";
import isAdmin from "../../middleware/auth/isAdmin";
const router = new Router();

router.get("/", auth, show);
router.post("/create", auth, create);
router.delete("/delete", auth, remove);
router.get("/showAdmin", auth, isAdmin, index);
router.put("/updateStatus/:id", auth, isAdmin, update);
export default router;
