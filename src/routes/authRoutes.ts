import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body } from "express-validator";
import { handleInputValidation } from "../middleware/validation";

const router = Router();

// CREATE ACCOUNT
router.post(
  "/create-account",
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("need to be an email"),
  body("password").notEmpty().withMessage("password is required"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
  body("name").notEmpty().withMessage("name is required"),
  handleInputValidation,
  AuthController.createAccount
);

// CONFIRM ACCOUNT
router.post(
  "/confirm-account",
  body("token").notEmpty().withMessage("token cant be empty"),
  handleInputValidation,
  AuthController.confirmAccount
);

// LOGIN
router.post(
  "/login",
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("need to be an email"),
  body("password").notEmpty().withMessage("password is required"),
  handleInputValidation,
  AuthController.login
);

// REQUEST CONFIRMATION CODE
router.post(
  "/request-code",
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("need to be an email"),
  handleInputValidation,
  AuthController.requestConfirmationCode
);

export default router;
