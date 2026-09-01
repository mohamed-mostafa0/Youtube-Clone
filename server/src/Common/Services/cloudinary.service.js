import { v2 as cloudinaryV2 } from 'cloudinary';

cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

export const uploadVideoOnCloudinary = async (file) => {

    const result = await cloudinaryV2.uploader.upload(
        file.path,
        {
            resource_type: "video",
            folder: "youtube-clone-videos",
            eager: [
                { streaming_profile: "hd", format: "m3u8" }
            ],
            eager_async: true
        }
    )
    return result
}

export const uploadImageOnCloudinary = async (file ,folderName) => {
    const result = await cloudinaryV2.uploader.upload(
        file.path,
        {
            resource_type: "image",
            // folder: "youtube-clone-thumbnails"
            folder: folderName
        }
    )
    return result
}

export const deleteResourceOnCloudinary = async (publicId , resource_type)=>{
    const result = await cloudinaryV2.uploader.destroy(
        publicId,
        {
            resource_type
        }
    )
    return result
}

