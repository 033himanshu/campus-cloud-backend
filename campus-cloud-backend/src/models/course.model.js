import mongoose, {Schema} from "mongoose";

const courseSchema = new Schema({
    name : {
        required: true,
        type : String,
        unique : true,
        lowercase : true,
        trim : true,
        index : true,
    },
    maximumSemester : {
        required: true,
        type : Number,
        min: [4, 'invalid semester, maximum semester should atleast 4 in any course']
    },
    department : {
        required : true,
        type : Schema.Types.ObjectId,
        ref : "Department",
    },
}, {timestamps:true})

export const Course = mongoose.model("Course", courseSchema)