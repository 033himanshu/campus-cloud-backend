import mongoose, {Schema} from "mongoose";

const attendenceSchema = new Schema({
    classRef : {
        required : true,
        type : Schema.Types.ObjectId,
        ref : "Class",
    },
    student : {
        required: true,
        type : Schema.Types.ObjectId,
        ref : "User",
    },
    attendence : {
        type: [Date],
        required: true
    }
}, {timestamps:true})

export const Attendence = mongoose.model("Attendence", attendenceSchema)