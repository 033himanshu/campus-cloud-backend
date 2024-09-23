import mongoose, {Schema} from "mongoose";

const announcementSchema = new Schema({
    type : {
        type : String,
        enum : ["opportunity", "message", "notice"],
        required: true,
        default : "opportunity",
    },
    owner: {
        required : true,
        type: Schema.Types.ObjectId,
        ref : "User",
    },
    receiver: {
        required :true,
        type : [],
    },
    subject : {
        type : String,
        required: true,
    },
    data : {
        type : String,
        required: true,
    },
}, {timestamps:true})

export const Announcement = mongoose.model("Announcement", announcementSchema)