import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    resultValue:{
        type:String,
        require:true
    },
    unit:{
        type:String,
        require:true
    },
    referenceRange:{
        type:String,
        require:true
    },
    status:{
        type:String,
        enum:["pending", "in progress", "completed"],
        require:true
    },
    laboratoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Laboratory",
        require:true
    }
}, {collection:"Test", timestamps:true});

const Test = mongoose.model("Test", testSchema);

export default Test;