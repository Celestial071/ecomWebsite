import mongoose from "mongoose"

export const connDB = async (str) => {
    try {
        const conn = await mongoose.connect(str);
        console.log(`connected to database: ${conn.connection.host}`)
    }catch(error) {
        console.log("Error connecting to the database ", error.message)
        process.exit(1)
    };
};
