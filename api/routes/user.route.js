import express from "express";
import {
  deleteUserAccount,
  getUser,
  getUserListing,
  test,
  updateUser,
} from "../controller/user.controller.js";
import { varifyToken } from "../utils/variefyToken.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", varifyToken, updateUser);
router.delete("/delete/:id", varifyToken, deleteUserAccount);
router.get("/listing/:id", varifyToken, getUserListing);
router.get("/:id", varifyToken, getUser);

export default router;
