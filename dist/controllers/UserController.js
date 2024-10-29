"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const User_1 = __importDefault(require("../model/User"));
class UserController {
    static async getUserById(req, res) {
        try {
            const userId = req.params.id;
            const user = await User_1.default.findById(userId);
            if (!user) {
                res.status(404).json({ message: "User not found" });
            }
            const userInfo = {
                id: user.id,
                email: user.email,
                name: user.name,
                confirmed: user.confirmed,
                favorites: user.favorites,
            };
            res.json(userInfo);
        }
        catch (error) {
            res.status(500).json({ message: "Error fetching user" });
        }
    }
    static async addFavorite(req, res) {
        try {
            const userId = req.params.id;
            const { movieId } = req.body;
            const user = await User_1.default.findById(userId);
            if (!user) {
                res.status(404).json({ message: "User not found" });
            }
            const movieExists = user.favorites.includes(movieId);
            if (movieExists) {
                const favorites = user.favorites.filter((id) => id !== movieId);
                user.favorites = favorites;
                await user.save();
                res.status(409).json({ message: "Movie already favorited" });
            }
            else {
                user.favorites.push(movieId);
                await user.save();
            }
            res.json({ message: "Favorite added" });
        }
        catch (error) {
            res.status(500).json({ message: "Error adding favorite" });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map