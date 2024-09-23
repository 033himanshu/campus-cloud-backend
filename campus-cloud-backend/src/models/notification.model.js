import mongoose, {Schema} from "mongoose";

const notificationSchema = new Schema({
    user: {
        required: true,
        type : Schema.Types.ObjectId,
        ref : "User",
    },
    announcement : {
        required: true,
        type : Schema.Types.ObjectId,
        ref : "Announcement",
    },
    type : {
        type : String,
        enum : ["opportunity", "message", "notice"],
        required: true,
        default : "opportunity",
    },
    read : {
        type : Boolean,
        default : false,
    }
}, {timestamps:true})

export const Notification = mongoose.model("Notification", notificationSchema)