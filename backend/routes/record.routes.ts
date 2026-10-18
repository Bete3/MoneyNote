import { Router } from "express";
import {
  createRecord, listRecords, getRecord, updateRecord,
  deleteRecord, repayRecord, summary,
} from "../controllers/record.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createRecordSchema, updateRecordSchema, repaySchema,
} from "../validators/record.validator";

const r = Router();
r.use(requireAuth);
r.get("/summary", summary);
r.get("/", listRecords);
r.post("/", validate(createRecordSchema), createRecord);
r.get("/:id", getRecord);
r.put("/:id", validate(updateRecordSchema), updateRecord);
r.post("/:id/repay", validate(repaySchema), repayRecord);
r.delete("/:id", deleteRecord);
export default r;