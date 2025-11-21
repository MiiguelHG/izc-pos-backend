import express from "express";
import { MuseoController } from "../controllers/museoController.js";

const router = express.Router();

router.post("/", MuseoController.createMuseo);
router.get("/", MuseoController.getAllMuseos);
router.get("/:id", MuseoController.getMuseoById);
router.put("/:id", MuseoController.updateMuseo);
router.delete("/:id", MuseoController.deleteMuseo);

export default router;