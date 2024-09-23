import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import { ApiError } from './ApiError.js';


const config = () => {
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET,
    })
}



const uploadOnCloudinary = async (localFilePath) =>{
    config()
    console.log(process.env.CLOUDINARY_API_KEY)
    try{
        if(!localFilePath){ 
            console.log("Local path is empty")
            return null
        }
        //upload the  file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        })
        // file has been  uploaded succesfully
        console.log("file uploaded successfully", response)
        fs.promises.unlink(localFilePath);
        return response
    }catch(error){
        fs.promises.unlink(localFilePath); // remove the  locally saved temporary file as the  upload operation got failed
        console.log(error)
        return null;
    }
}

const deleteFileFromCloudinary = async(cloudinaryFilePath, newImageLocalPath) => {
    config()
    try {
        if(!cloudinaryFilePath) {
            throw new Error("Path Not Found")
        }
        console.log(cloudinaryFilePath)
        let cloudinaryPath = cloudinaryFilePath.split('/').pop().split('.')[0]
        console.log(cloudinaryPath)
        const imageFileResponse =  await cloudinary.api.delete_resources([cloudinaryPath], { type: 'upload', resource_type: 'image' })
        const videoFileResponse =  await cloudinary.api.delete_resources([cloudinaryPath], { type: 'upload', resource_type: 'video' })
        console.log("file deleted successfully", imageFileResponse)
        console.log("file deleted successfully", videoFileResponse)
        return {imageFileResponse, videoFileResponse}
    } catch (error) {
        if(newImageLocalPath){
            fs.promises.unlink(newImageLocalPath);
            console.log("Error is occuring new file deleted")
        }
        throw new ApiError(400, `Error in Deleting old Image file from cloudinary, ${error}`)
    }
}

export {uploadOnCloudinary, deleteFileFromCloudinary}