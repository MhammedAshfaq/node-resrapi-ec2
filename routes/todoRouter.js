import express from "express";
import {
  createTodo,
  deleteTodo,
  listTodo,
  updateTodo,
} from "../controllers/todoContraoller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createTodo);

router.patch("/update/:id", protect, updateTodo);

router.delete("/delete/:id", protect, deleteTodo);

router.post("/list", protect, listTodo);

export default router;
