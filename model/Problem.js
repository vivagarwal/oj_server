const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true
    },

    description: {
        type: String,
        required : true,

    },
    inputs: {
        type: [String],
        required : true,
    },
    outputs:{
        type:[String],
        required:true,
    },
    testCases: [{ 
        input: String, 
        expectedOutput: String 
    }], 
} , {timestamps:true});

module.exports = mongoose.model("problem", problemSchema);