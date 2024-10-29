"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const colors_1 = __importDefault(require("colors"));
const node_process_1 = require("node:process");
const connectDB = async () => {
    const { DATABASE_URL } = process.env;
    if (!DATABASE_URL) {
        throw new Error("DATABASE_URL is not set");
    }
    try {
        const conection = await mongoose_1.default.connect(DATABASE_URL);
        const url = `${conection.connection.host}:${conection.connection.port}`;
        console.log(colors_1.default.green.bold(`Connected to MongoDB at ${url}`));
    }
    catch (err) {
        console.error(colors_1.default.red.bold(`Error connecting to MongoDB`));
        (0, node_process_1.exit)(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map