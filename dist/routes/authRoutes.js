"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const express_validator_1 = require("express-validator");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
// CREATE ACCOUNT
router.post("/create-account", (0, express_validator_1.body)("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("need to be an email"), (0, express_validator_1.body)("password").notEmpty().withMessage("password is required"), (0, express_validator_1.body)("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error("Passwords do not match");
    }
    return true;
}), (0, express_validator_1.body)("name").notEmpty().withMessage("name is required"), validation_1.handleInputValidation, AuthController_1.AuthController.createAccount);
// CONFIRM ACCOUNT
router.post("/confirm-account", (0, express_validator_1.body)("token").notEmpty().withMessage("token cant be empty"), validation_1.handleInputValidation, AuthController_1.AuthController.confirmAccount);
// LOGIN
router.post("/login", (0, express_validator_1.body)("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("need to be an email"), (0, express_validator_1.body)("password").notEmpty().withMessage("password is required"), validation_1.handleInputValidation, AuthController_1.AuthController.login);
// REQUEST CONFIRMATION CODE
router.post("/request-code", (0, express_validator_1.body)("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("need to be an email"), validation_1.handleInputValidation, AuthController_1.AuthController.requestConfirmationCode);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map