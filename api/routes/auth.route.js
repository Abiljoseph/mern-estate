import express from "express";
import {
  googleSignIn,
  signIn,
  signOut,
  signup,
} from "../controller/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signIn);
router.post("/google", googleSignIn);
router.get("/signOut", signOut);

export default router;
