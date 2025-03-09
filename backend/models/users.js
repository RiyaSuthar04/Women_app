
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["illiterate", "literate"], // Fixed typo
  },
  skills: {
    type: String,
  },
  education: {
    type: String,
  },
  job: {
    type: String,
  },
  status: {
    type: String,
    enum: ["online", "offline"],
    default: "offline", // Default to offline when a user is created
  },
});

// ✅ Middleware to enforce required fields based on role
userSchema.pre("save", function (next) {
  if (this.role === "illiterate" && !this.skills) {
    return next(new Error("Skills are required for illiterate users"));
  }
  if (this.role === "literate" && (!this.education || !this.job)) {
    return next(new Error("Education and Job are required for literate users"));
  }
  next();
});



// Hash password before saving to the database
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password for login
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Users = mongoose.model("Users", userSchema);

module.exports = Users;