import express from "express";
import { getPresidentialCandidates } from "../controllers/candidatesController.js";

const router = express.Router();

router.get("/presidential-candidates", getPresidentialCandidates);

export default router;
