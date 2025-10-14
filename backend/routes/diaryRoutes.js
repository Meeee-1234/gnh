
import express from "express";
import { addDiary, getDiaries } from "../controllers/diaryController.js";

const router = express.Router();

router.post("/", addDiary);
router.get("/", getDiaries);

export default router;
