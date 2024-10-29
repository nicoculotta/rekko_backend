import type { Request, Response } from "express";
export declare class AuthController {
    static createAccount(req: Request, res: Response): Promise<void>;
    static confirmAccount(req: Request, res: Response): Promise<void>;
    static login(req: Request, res: Response): Promise<void>;
    static requestConfirmationCode(req: Request, res: Response): Promise<void>;
}
