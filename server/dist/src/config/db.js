"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
exports.disconnectFromDatabase = disconnectFromDatabase;
exports.getDbState = getDbState;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectToDatabase(uri) {
    await mongoose_1.default.connect(uri);
}
async function disconnectFromDatabase() {
    if (mongoose_1.default.connection.readyState !== 0) {
        await mongoose_1.default.disconnect();
    }
}
function getDbState() {
    const readyState = mongoose_1.default.connection.readyState;
    return {
        readyState,
        connected: readyState === 1
    };
}
