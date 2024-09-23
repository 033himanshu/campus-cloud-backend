import mongoose, {Schema} from "mongoose";

const materialSchema = new Schema({
    classRef : {
        required: true,
        type : Schema.Types.ObjectId,
        ref : "Class",
    },
    file : {
        type : String,
    },
    info : {
        type : String,
        required : true,
    },
}, {timestamps:true})



export const Material = mongoose.model("Material", materialSchema)