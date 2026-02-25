"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const application_controller_1 = require("../controllers/application.controller");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.authMiddleware, application_controller_1.applyToJob);
router.get("/", auth_middleware_1.authMiddleware, application_controller_1.getApplications);
exports.default = router;
