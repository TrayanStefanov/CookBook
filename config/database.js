import mongoose from "mongoose";
const connectDatabase = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connection to DB successfull");
    } catch(error) {
        console.log("Connection to DB failed");
        process.exit(1);
    }
};

export default connectDatabase;