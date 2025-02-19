import express from "express";
import { signup, logout, login, renewToken} from "../controller/user.controller.js"
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/renewToken", renewToken);
//router.get("/userProfile", protectRoute ,userProfile);

export default router;
