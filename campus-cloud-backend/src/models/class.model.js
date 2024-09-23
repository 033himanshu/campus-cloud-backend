import mongoose, {Schema} from "mongoose";

const classSchema = new Schema({
    subject: {
        required:true,
        type : Schema.Types.ObjectId,
        ref : "Subject",
    },
    teacher : {
        required: true,
        type : Schema.Types.ObjectId,
        ref : "User",
    },
    totalClass : {
        type : Number,
        default : 0,
    }
}, {timestamps:true})

export const Class = mongoose.model("Class", classSchema)