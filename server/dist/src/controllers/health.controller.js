"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealth = getHealth;
const health_service_1 = require("../services/health.service");
const http_1 = require("../utils/http");
function getHealth(_req, res) {
    const payload = (0, health_service_1.getHealthPayload)();
    const status = payload.db.connected ? http_1.HTTP.ok : http_1.HTTP.serviceUnavailable;
    res.status(status).json(payload);
}
