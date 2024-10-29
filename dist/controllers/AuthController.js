"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = __importDefault(require("../model/User"));
const auth_1 = require("../utils/auth");
const Token_1 = __importDefault(require("../model/Token"));
const token_1 = require("../utils/token");
const AuthEmail_1 = require("../email/AuthEmail");
class AuthController {
    static async createAccount(req, res) {
        try {
            const { password, email } = req.body;
            // Prevent duplicate emails
            const userExists = await User_1.default.findOne({ email });
            if (userExists) {
                res.status(409).json({ error: "Email already exists" });
            }
            // Create user
            const user = new User_1.default(req.body);
            //Hash password
            user.password = await (0, auth_1.hashPassword)(password);
            // Generate token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            // Send email
            AuthEmail_1.AuthEmail.sendConfirmationEmail({
                email,
                name: user.name,
                token: token.token,
            });
            // Save user in database
            await Promise.allSettled([user.save(), token.save()]);
            res.status(201).json(user);
        }
        catch (error) {
            res.status(500).json({ error: "Something went wrong" });
        }
    }
    static async confirmAccount(req, res) {
        try {
            const { token } = req.body;
            const tokenExist = await Token_1.default.findOne({ token });
            if (!tokenExist) {
                res.status(404).json({ error: "Token not found" });
            }
            const user = await User_1.default.findById(tokenExist.user);
            user.confirmed = true;
            await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
            res.status(200).json({ message: "Account confirmed" });
            console.log(token);
        }
        catch (error) {
            res.status(500).json({ error: "Something went wrong" });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User_1.default.findOne({ email });
            if (!user) {
                res.status(404).json({ error: "User not found" });
            }
            if (!user.confirmed) {
                const token = new Token_1.default();
                token.user = user.id;
                token.token = (0, token_1.generateToken)();
                // Send email with new token
                AuthEmail_1.AuthEmail.sendConfirmationEmail({
                    email,
                    name: user.name,
                    token: token.token,
                });
                res
                    .status(401)
                    .json({ error: "User not confirmed, email confirmation sent" });
            }
            // Password check
            const isPasswordCorrect = await (0, auth_1.checkPassword)(password, user.password);
            if (!isPasswordCorrect) {
                res.status(401).json({ error: "Incorrect password" });
            }
            res.send("autenticado");
        }
        catch (error) {
            res.status(500).json({ error: "Something went wrong" });
        }
    }
    static async requestConfirmationCode(req, res) {
        try {
            const { email } = req.body;
            // User exist
            const user = await User_1.default.findOne({ email });
            if (!user) {
                res.status(409).json({ error: "Email doesn't exists" });
            }
            if (user.confirmed) {
                res.status(409).json({ error: "User already confirmed" });
            }
            // Generate token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            // Send email
            AuthEmail_1.AuthEmail.sendConfirmationEmail({
                email,
                name: user.name,
                token: token.token,
            });
            // Save user in database
            await Promise.allSettled([user.save(), token.save()]);
            res.status(200).json({ message: "Se envio un nuevo token a tu email" });
        }
        catch (error) {
            res.status(500).json({ error: "Something went wrong" });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map