"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
const http_1 = require("../utils/http");
function notFoundHandler(_req, res) {
    res.status(http_1.HTTP.notFound).json({
        ok: false,
        message: "Route not found"
    });
}
