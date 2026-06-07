const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Naam zaroori hai"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number zaroori hai"],
      unique: true,
      match: [/^[6-9]\d{9}$/, "Valid Indian phone number daalo"],
    },
    password: {
      type: String,
      required: [true, "Password zaroori hai"],
      minlength: 6,
      select: false,
    },
    state: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    cropTypes: {
      type: [String],
      default: [],
    },
    role: {
      type: String,
      enum: ["farmer", "admin"],
      default: "farmer",
    },
  },
  {
    timestamps: true,
  }
);

// Password save hone se pehle hash karo
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Login ke waqt password compare karo
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
