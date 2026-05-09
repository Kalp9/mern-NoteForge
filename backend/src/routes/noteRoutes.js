import express from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from "../controllers/noteControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);

router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
