import multer from 'multer'

import { allowedFileExtenstions, allowedFileTypes } from '../Common/index.js'


export const upload = () => {
    
    
    const storage = multer.diskStorage({})
    // const storage = multer.diskStorage({
    //     destination:(req , file , cb)=>{
    //         const fullPath = `uploads/${folderPath}`;
    //         if (!fs.existsSync(fullPath)) {
    //             fs.mkdirSync(fullPath, { recursive: true });
    //         }
    //         cb(null , fullPath)
    //     },
    //     filename:(req , file , cb)=>{
    //         console.log(file.originalname);
            
    //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //         cb(null , uniqueSuffix + file.originalname)
            
    //     }
    // })

    const fileFilter = (req , file , cb)=>{

        const fileKey = file.mimetype.split("/")[0].toUpperCase()

        const fileType = allowedFileTypes[fileKey]

        // const allowedFileTypesMapper = Object.values(allowedFileTypes)
        // console.log("allowedFileTypesMapper:"+allowedFileTypesMapper);
        
        if(!fileType) return cb(new Error(`invalid file type , allowed file types:${Object.values(allowedFileTypes)}`) , false)
        
        const fileExtenstion = file.mimetype.split("/")[1]

        if(!allowedFileExtenstions[fileType].includes(fileExtenstion)){
            return cb(new Error(`invalid file extenstion , allowed file extenstions: ${allowedFileExtenstions[fileType].join(", ")}`) , false)
        }

        return cb(null , true)

    }
    
    


return multer({fileFilter , storage , limits: {
    fileSize: 100 * 1024 * 1024
}})
}

