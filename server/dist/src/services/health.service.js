"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealthPayload = getHealthPayload;
const db_1 = require("../config/db");
function getHealthPayload() {
    return {
        ok: true,
        service: "odyssey-server",
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        db: (0, db_1.getDbState)()
    };
}
