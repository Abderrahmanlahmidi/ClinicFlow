import express from "express";
const router = express.Router();
import {
    createTest,
    getAllTests,
    getTestById,
    updateTest,
    deleteTest
} from "../../controllers/testController.js";


router.post("/create-test", createTest);


router.get("/tests", getAllTests);


router.get("/test/:id", getTestById);


router.patch("/update-test/:id", updateTest);


router.delete("/delete-test/:id", deleteTest);

export default router;
