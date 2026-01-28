import { v2 as cloudinary } from 'cloudinary';

import fs from "fs"

    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
    });


const uploacOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //return error msg
        //upload the file on cloudinary
        //upload hone m time lagega
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto"
        })

        //file has been uploaded succesfully
        console.log("file is uploaded on cloudinary", response.url);
        return response;
        
    } catch(error){
        //incase, file succesfully not uploaded 
        fs.unlinkSync(localFilePath) //remove the locally saved temperory file as the upload operation got failed.
        return null;

    }
}

export {uploacOnCloudinary}