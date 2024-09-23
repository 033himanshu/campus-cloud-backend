import mongoose, {Schema} from "mongoose";

const adminSchema = new Schema({
    user : {
        required: true,
        type : Schema.Types.ObjectId,
        ref : "User",
    },
}, {timestamps:true})



export const Admin = mongoose.model("Admin", adminSchema)