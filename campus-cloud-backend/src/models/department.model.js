import mongoose, {Schema} from "mongoose";

const departmentSchema = new Schema({
    name : {
        required: true,
        type : String,
        unique : true,
        lowercase : true,
        trim : true,
        index : true,
    }, 
    hod : {
        type : Schema.Types.ObjectId,
        ref : "User",
    }
}, {timestamps:true})

export const Department = mongoose.model("Department", departmentSchema)