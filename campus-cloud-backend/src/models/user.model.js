import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    fullName : {
        required: true,
        type : String,
    }, 
    profile: {
        type : String,
    },
    role: {
        type: String,
        enum: ["student", "teacher", "admin"], 
        required: true,
        default: "student",
    },
    username : {
        required: true,
        type: String,
        unique : true,
        lowercase : true,
        trim : true,
        index : true,
    },
    password: {
        required: true,
        type : String,
    },
    refreshToken : { 
        type : String,
    }
}, {timestamps:true})


userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,  this.password)
}

userSchema.methods.generateAccessToken = function(){
    console.log("In generateAccessToken method")
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            role : this.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    console.log("In generateRefreshToken method")
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)