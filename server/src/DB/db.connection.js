import mongoose from 'mongoose'



const dbConnection = async()=>{
    try{
    await mongoose.connect("mongodb+srv://ma7rous1122_db_user:s00K82bcTT3zE8at@cluster0.jmfxhkc.mongodb.net/?appName=Cluster0")
    console.log("Connected to DB");
    
    }catch(err){
        console.log("FAILED TO CONNECT TO DATABASE:" , err); 
    }
}

export default dbConnection