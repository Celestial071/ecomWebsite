import express from "express";
import { signup, logout, login, renewToken, getProfile} from "../controller/user.controller.js"
import {protectRoute} from "../middleware/auth.middleware.js"
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/renewToken", renewToken);
router.get("/profile", protectRoute ,getProfile);

export default router;
