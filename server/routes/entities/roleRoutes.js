import express from "express";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../../controllers/roleController.js";

const router = express.Router();

router.get("/get-roles", getRoles);
router.post("/create-role", createRole);
router.patch("/update-role/:id", updateRole);
router.delete("/delete-role/:id", deleteRole);

export default router;
