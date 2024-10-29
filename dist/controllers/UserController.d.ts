import type { Request, Response } from "express";
export declare class UserController {
    static getUserById(req: Request, res: Response): Promise<void>;
    static addFavorite(req: Request, res: Response): Promise<void>;
}
