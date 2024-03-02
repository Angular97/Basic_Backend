const mongoose = require("mongoose");

let connectDB = async () => {
  try {
    const connect = await mongoose.connect(
      `${process.env.MONGO_URL}/${process.env.DB_NAME}`
    );
    console.log(`\n MongoDB connected !! DB HOST: ${connect.connection.host}`);
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

module.exports = connectDB;
