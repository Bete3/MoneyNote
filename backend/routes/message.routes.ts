import { Router } from "express";
import { listMessages, markRead, markAllRead } from "../controllers/message.controller";
import { requireAuth } from "../middleware/auth";

const r = Router();
r.use(requireAuth);
r.get("/", listMessages);
r.patch("/read-all", markAllRead);
r.patch("/:id/read", markRead);
export default r;