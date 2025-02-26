const mongoose = require("mongoose");
require("dotenv").config();

// Define the MongoDB connection URL
const mongoURL = process.env.MONGODB_URL_LOCAL;
// const mongoURL = process.env.MONGODB_URL; //Replace 'mydatabase' with your database name

// mongoose.connect(mongoURL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

mongoose.connect(mongoURL);

// Get the default connection
// Mongoose maintains a default connection object representing the MongoDB connection.

const db = mongoose.connection;

// Define event listeners for database connection

db.on("connected", () => {
  console.log("Connected to MongoDB server");
});

db.on("error", () => {
  console.log("MongoDB connection error");
});

db.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// Export the database connection
module.exports = db;
