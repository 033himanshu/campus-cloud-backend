import mongoose, {Schema} from "mongoose";

const studentSchema = new Schema({
    user : {
        required: true,
        type : Schema.Types.ObjectId,
        ref : "User",
    },
    sem : {
        type : Number,
        required : true,
    },
    course : {
        required : true,
        type : Schema.Types.ObjectId,
        ref : "Course",
    },
    rollno: { 
        type: String, 
        required: true, 
        unique: true 
    },
}, {timestamps:true})

export const Student = mongoose.model("Student", studentSchema)