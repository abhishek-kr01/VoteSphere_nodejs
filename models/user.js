const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the Person schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
  },
  mobile: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Mobile number must be 10 digits"],
  },
  address: {
    type: String,
    required: true,
  },
  aadharCardNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["voter", "admin"],
    default: "voter",
  },
  isVoted: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;

  // Hash the password only if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  try {
    // hash password generateion
    const salt = await bcrypt.genSalt(10);

    // hash password
    const hashPassword = await bcrypt.hash(user.password, salt);

    // Override the plain password with the hashed one
    user.password = hashPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (condidatePassword) {
  try {
    // Use bcrypt to compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(condidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
