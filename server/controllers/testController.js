import Test from "../models/Test.js";


export const createTest = async (req, res) => {
    const {name, resultValue, unit, referenceRange, status, laboratoryId} = req.body;
    if (!name || !resultValue || !unit || !referenceRange || !status) {
        return res.status(400).json({error: "Missing required fields"});
    }
    try {
        const newTest = new Test({name, resultValue, unit, referenceRange, status, laboratoryId});
        const savedTest = await newTest.save();
        res.status(201).json(savedTest);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


export const getAllTests = async (req, res) => {
    try {
        const tests = await Test.find();
        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


export const getTestById = async (req, res) => {
    const {id} = req.params;
    try {
        const test = await Test.findById(id);
        if (!test) return res.status(404).json({error: "Test not found"});
        res.status(200).json(test);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


export const updateTest = async (req, res) => {
    const {id} = req.params;
    const updates = req.body;
    try {
        const updatedTest = await Test.findByIdAndUpdate(id, updates, {new: true});
        if (!updatedTest) return res.status(404).json({error: "Test not found"});
        res.status(200).json(updatedTest);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


export const deleteTest = async (req, res) => {
    const {id} = req.params;
    try {
        const deletedTest = await Test.findByIdAndDelete(id);
        if (!deletedTest) return res.status(404).json({error: "Test not found"});
        res.status(200).json({message: "Test deleted successfully"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
