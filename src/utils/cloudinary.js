import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const options = {
  use_filename: true,
  unique_filename: false,
  overwrite: false,
  resource_type: "auto",
};

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // Upload the file on cloudinary,
    const response = await cloudinary.uploader.upload(localFilePath, options);
    // File has been successfuly uploaded;
    console.log(`file uploaded successfuly ${response.url}`);
    return response;
  } catch (err) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};
