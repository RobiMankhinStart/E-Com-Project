const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
    },
    fullName: {
      type: String,
      trim: true,
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
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "user", "editor"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: Number,
      default: null,
    },
    otpExpires: {
      type: Date,
    },
    resetPassToken: {
      type: String,
    },
    resetExpire: {
      type: Date,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  const user = this;
  if (!user.isModified("password")) {
    return;
  }

  try {
    user.password = await bcrypt.hash(user.password, 10);
  } catch (err) {}
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("user", userSchema);
