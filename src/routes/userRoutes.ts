import { Router } from "express";
import { UserController } from "../controllers/UserController";

const router = Router();

router.get("/:id", UserController.getUserById);
router.post("/:id/favorite", UserController.addFavorite);

export default router;
