const mongoose=require("mongoose");
const {DB_NAME}=require("../constants");

const connectDB=async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("successfult connected to DB");
    } catch (error) {
        console.log("error occured while connecting to DB");
    }
}

module.exports=connectDB;