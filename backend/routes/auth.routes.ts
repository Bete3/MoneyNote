import { Router } from "express";
import { z } from "zod";
import { register, login, me } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";

const registerSchema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
	password: z.string().min(6),
});

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

const r = Router();
r.post("/register", validate(registerSchema), register);
r.post("/login", validate(loginSchema), login);
r.get("/me", requireAuth, me);
export default r;