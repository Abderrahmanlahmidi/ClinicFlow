import express from "express";
import multer from "multer";
import isAuthenticated from "../../middlewares/isAuthenticated.js";
import { getUsers, updateProfile } from "../../controllers/userController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg, and .png files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

router.get("/users", isAuthenticated(["Admin"]), getUsers);
router.patch("/update-profile/:id", upload.single("imageProfile"), updateProfile);

export default router;
