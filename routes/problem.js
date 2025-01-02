const express = require("express");
const Problem = require("../model/Problem.js");
const router = express.Router();

// Create a new problem
router.post("/api/problems", async (req, res) => {
    try {
        const { name, description, inputs, outputs, testCases } = req.body;

        // Check that all the data exists and is not empty
        if (!name || !description || !inputs || !outputs || !testCases) {
            return res.status(400).json({message:"Please enter all the information"});
        }

        // Additional check for empty arrays
        if (inputs.length === 0 || outputs.length === 0 || testCases.length === 0) {
            return res.status(400).json({message:"Inputs, Outputs, and Test Cases cannot be empty"});
        }

        // Additional check for test cases structure
        for (const testCase of testCases) {
            if (!testCase.input || !testCase.expectedOutput) {
                return res.status(400).json({message:"Each test case must have an input and an expected output"});
            }
        }

        //check if already that problem is being created or not
        const existingProblem = await Problem.findOne({ name });
        if (existingProblem) { // problem name already exists
            return res.status(400).send({message:"Problem Name Already Exists, Please change the name"});
        }

        const newProblem = new Problem({ name, description, inputs, outputs, testCases });
        await newProblem.save();
        return res.status(201).json({ message: "You have successfully created the problem!", newProblem });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get all problems
router.get("/api/problems", async (req, res) => {
    try {
        const problems = await Problem.find();
        return res.status(200).json(problems);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get a single problem by id
router.get("/api/problems/:id", async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }
        res.status(200).json(problem);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Update a problem by id
router.put("/api/problems/:id", async (req, res) => {
    try {
        const { name, description, inputs, outputs, testCases } = req.body;

        // Validate all fields are present and non-empty
        if (!name || !description || !inputs || !outputs || !testCases) {
            return res.status(400).json({message:"Please enter all the information"});
        }

        // Additional checks for non-empty arrays
        if (inputs.length === 0 || outputs.length === 0 || testCases.length === 0) {
            return res.status(400).json({message :"Inputs, Outputs, and Test Cases cannot be empty"});
        }

        // Check if each testCase has required fields
        for (const testCase of testCases) {
            if (!testCase.input || !testCase.expectedOutput) {
                return res.status(400).json({message:"Each test case must have an input and an expected output"});
            }
        }

        const updatedProblem = await Problem.findByIdAndUpdate(
            req.params.id,
            { name, description, inputs, outputs, testCases },
            { new: true } // Return the updated document
        );

        if (!updatedProblem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        // Send success response
        return res.status(200).json({
            message: "Problem updated successfully",
            updatedProblem
        });
    } catch (error) {
        // Send error response
        return res.status(500).json({ message: error.message });
    }
});

// Delete a problem by id
router.delete("/api/problems/:id", async (req, res) => {
    try {
        const deletedProblem = await Problem.findByIdAndDelete(req.params.id);
        if (!deletedProblem) {
            return res.status(404).json({ message: "Problem not found" });
        }
        res.status(200).json({ message: "Problem deleted" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;