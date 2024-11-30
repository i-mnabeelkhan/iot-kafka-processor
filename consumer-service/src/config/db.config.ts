import mongoose from "mongoose";

export const connectDb = async () => {
  await mongoose
    .connect("mongodb://localhost:27017/test-db")
    .then(() => {
      console.log("✅ Connected to database");
    })
    .catch((error) => {
      console.log("\n\n❌ Error connecting to database: ", error);
    });
};
