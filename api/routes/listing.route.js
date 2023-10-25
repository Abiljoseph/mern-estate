import express from "express";
import {
  UpdateListing,
  createListing,
  deleteListing,
  getListing,
  getListings,
} from "../controller/listing.controller.js";
import { varifyToken } from "../utils/variefyToken.js";

const router = express.Router();

router.post("/create", varifyToken, createListing);
router.delete("/delete/:id", varifyToken, deleteListing);
router.put("/update/:id", varifyToken, UpdateListing);
router.get("/get/:id", getListing);
router.get("/get", getListings);

export default router;
