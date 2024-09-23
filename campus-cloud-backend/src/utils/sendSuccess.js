import { ApiResponse } from "./ApiResponse.js";
const sendSuccess = (res, data, message = "Success") => {
    return res.status(200).json(new ApiResponse(200, data, message));
}
export {sendSuccess}