import type { Request, Response } from "express";
import User from "../model/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../model/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../email/AuthEmail";

export class AuthController {
  static async createAccount(req: Request, res: Response) {
    try {
      const { password, email } = req.body;

      // Prevent duplicate emails
      const userExists = await User.findOne({ email });
      if (userExists) {
        res.status(409).json({ error: "Email already exists" });
      }

      // Create user
      const user = new User(req.body);

      //Hash password
      user.password = await hashPassword(password);

      // Generate token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      // Send email
      AuthEmail.sendConfirmationEmail({
        email,
        name: user.name,
        token: token.token,
      });

      // Save user in database

      await Promise.allSettled([user.save(), token.save()]);

      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  }

  static async confirmAccount(req: Request, res: Response) {
    try {
      const { token } = req.body;
      const tokenExist = await Token.findOne({ token });

      if (!tokenExist) {
        res.status(404).json({ error: "Token not found" });
      }

      const user = await User.findById(tokenExist.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);

      res.status(200).json({ message: "Account confirmed" });

      console.log(token);
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        res.status(404).json({ error: "User not found" });
      }

      if (!user.confirmed) {
        const token = new Token();
        token.user = user.id;
        token.token = generateToken();

        // Send email with new token
        AuthEmail.sendConfirmationEmail({
          email,
          name: user.name,
          token: token.token,
        });

        res
          .status(401)
          .json({ error: "User not confirmed, email confirmation sent" });
      }

      // Password check
      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        res.status(401).json({ error: "Incorrect password" });
      }

      res.send("autenticado");
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  }

  static async requestConfirmationCode(req: Request, res: Response) {
    try {
      const { email } = req.body;

      // User exist
      const user = await User.findOne({ email });
      if (!user) {
        res.status(409).json({ error: "Email doesn't exists" });
      }

      if (user.confirmed) {
        res.status(409).json({ error: "User already confirmed" });
      }

      // Generate token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      // Send email
      AuthEmail.sendConfirmationEmail({
        email,
        name: user.name,
        token: token.token,
      });

      // Save user in database

      await Promise.allSettled([user.save(), token.save()]);

      res.status(200).json({ message: "Se envio un nuevo token a tu email" });
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
}
