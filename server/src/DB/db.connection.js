import mongoose from 'mongoose'



const dbConnection = async()=>{
    try{
    await mongoose.connect(process.env.DB_URI)
    console.log("Connected to DB");
    
    }catch(err){
        console.log("FAILED TO CONNECT TO DATABASE:" , err); 
    }
}

export default dbConnection