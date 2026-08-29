import mongoose from 'mongoose'



const dbConnection = ()=>{
    try{
    mongoose.connect("mongodb://localhost:27017/youtube")
    console.log("Connected to DB");
    
    }catch(err){
        console.log("FAILED TO CONNECT TO DATABASE:" , err); 
    }
}

export default dbConnection