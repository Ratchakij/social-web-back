import express from "express";
import * as authController from "../controllers/auth-controller.js";
// const authenticateMiddleware = require('../middlewares/authenticate');

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
// router.get('/me', authenticateMiddleware, authController.getMe);

export default router;
