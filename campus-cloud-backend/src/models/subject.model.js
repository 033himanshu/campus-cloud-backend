import mongoose, {Schema} from "mongoose";

const subjectSchema = new Schema({
    name : {
        required: true,
        type : String,
    },
    sem : {
        requried : true,
        type : Number,
    },
    course : {
        required : true,
        type : Schema.Types.ObjectId,
        ref : "Course",
    },
}, {timestamps:true})

export const Subject = mongoose.model("Subject", subjectSchema)