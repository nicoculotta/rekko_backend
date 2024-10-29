"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const router = (0, express_1.Router)();
router.get("/:id", UserController_1.UserController.getUserById);
router.post("/:id/favorite", UserController_1.UserController.addFavorite);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map