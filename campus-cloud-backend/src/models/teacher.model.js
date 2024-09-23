import mongoose, {Schema} from "mongoose";

const teacherSchema = new Schema({
    user : {
        required: true,
        type : Schema.Types.ObjectId,
        ref : "User",
    },
    department : {
        required : true,
        type : Schema.Types.ObjectId,
        ref : "Department",
    },
    
}, {timestamps:true})


export const Teacher = mongoose.model("Teacher", teacherSchema)