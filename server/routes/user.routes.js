import express from "express";
import { verifyUser, verifyAdmin } from "../middleware/auth.js";
import { getUser, getAllUsers, updateUser, deleteUser } from "../controllers/user.js";

const router = express.Router();

// Get user profile (protected route)
router.get("/:id", verifyUser, getUser);

// Update user profile (protected route)
router.patch("/:id", verifyUser, updateUser);

// Delete user (protected route)
router.delete("/:id", verifyUser, deleteUser);

// Admin-only: get all users
router.get("/admin/all", verifyAdmin, getAllUsers);

export default router;