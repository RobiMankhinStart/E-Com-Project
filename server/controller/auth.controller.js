const userSchema = require("../models/userSchema");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../services/cloudinaryService");
const { sendEmail } = require("../services/emailServices");
const { emailVerifyTem, resetPassEmailTemp } = require("../services/emailTemp");
const {
  generateOTP,
  generateAccessToken,
  generateRefreshToken,
  generateResetPassToken,
  hashResetToken,
  verifyToken,
} = require("../services/helpers");
const { responseHandler } = require("../services/responseHandler");
const { isValidEmail, isValidPass } = require("../services/validations");
const signupUser = async (req, res) => {
  try {
    const { fullName, email, password, phone, address } = req.body;
    if (!fullName)
      return responseHandler.error(res, 400, "Full Name is required");
    if (!email) return res.status(400).send({ message: "Email is required" });
    if (!isValidEmail(email))
      return responseHandler.error(res, 400, "Enter a valid email address");
    if (!password)
      return responseHandler.error(res, 400, "Password is required");
    // if (!isValidPass(password))
    //   return responseHandler.error(
    //     res,
    //     400,
    //     "Password must be at least 8 characters",
    //   );

    const existingUser = await userSchema.findOne({ email });
    if (existingUser)
      return responseHandler.error(res, 400, "Email already exist");

    const generatedOtp = generateOTP();
    const user = new userSchema({
      fullName,
      email,
      password,
      phone,
      address,
      otp: generatedOtp,
      otpExpires: Date.now() + 2 * 60 * 1000,
    });
    sendEmail({
      email,
      subject: "Email Verification",
      otp: generatedOtp,
      template: emailVerifyTem,
    });

    await user.save();
    return responseHandler.success(
      res,
      200,
      {},
      "Registration Successfylly, verify email",
    );
  } catch (error) {
    return responseHandler.error(res, 500, error.message);
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp) return responseHandler.error(res, 400, "OTP is required");
    if (!email) return responseHandler.error(res, 400, "Invalid Request");

    const user = await userSchema.findOne({
      email,
      otp: Number(otp),
      otpExpires: { $gt: new Date() },
      isVerified: false,
    });

    if (!user) {
      return responseHandler.error(res, 400, "Invalid or expired OTP");
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return responseHandler.success(res, 200, {}, "Verified successfully");
  } catch (error) {
    return responseHandler.error(res, 500, error.message);
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return responseHandler.error(res, 400, "Invalid Request");

    const user = await userSchema.findOne({
      email,
      isVerified: false,
    });
    if (!user) {
      return responseHandler.error(res, 400, "Invalid Request");
    }

    const generatedOtp = generateOTP();
    user.otp = generatedOtp;
    user.otpExpires = Date.now() + 2 * 60 * 1000;
    await user.save();
    sendEmail({
      email,
      subject: "Email Verification",
      otp: generatedOtp,
      template: emailVerifyTem,
    });

    return responseHandler.success(
      res,
      201,
      {},
      "OTP send to your email successfully.",
    );
  } catch (error) {
    return responseHandler.error(res, 500, error.message);
  }
};

const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return responseHandler.error(res, 400, "Email is required");
    if (!isValidEmail(email))
      return responseHandler.error(res, 400, "Enter a valid email address");
    if (!password)
      return responseHandler.error(res, 400, "Password is required");

    const existingUser = await userSchema.findOne({ email });
    if (!existingUser)
      return responseHandler.error(res, 400, "Email is not registered");

    const matchPass = await existingUser.comparePassword(password);
    if (!matchPass) return responseHandler.error(res, 400, "Wrong Password");
    if (!existingUser.isVerified)
      return responseHandler.error(res, 400, "Email is not verified.");

    const accToken = generateAccessToken(existingUser);
    const refToken = generateRefreshToken(existingUser);

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      path: "/",
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 3600000,
    };

    res.cookie("X-AS-Token", accToken, cookieOptions);
    res.cookie("X-RF-Token", refToken, {
      ...cookieOptions,
      maxAge: 1296000000,
    });

    return responseHandler.success(
      res,
      200,
      {
        user: {
          _id: existingUser._id,
          email: existingUser.email,
          fullName: existingUser.fullName,
          role: existingUser.role,
        },
      },
      "Login Successfully",
    );
  } catch (error) {
    return responseHandler.error(res, 500, error.message);
  }
};

const forgatePass = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return responseHandler.error(res, 400, "Email is required");
    if (!isValidEmail(email))
      return responseHandler.error(res, 400, "Enter a valid email address");

    const existingUser = await userSchema.findOne({ email });
    if (!existingUser)
      return responseHandler.error(res, 400, "Email is not registered");

    const { resetToken, hashedToken } = generateResetPassToken();
    existingUser.resetPassToken = hashedToken;
    existingUser.resetExpire = Date.now() + 2 * 60 * 1000;
    await existingUser.save();
    const RESET_PASSWORD_LINK = `${
      process.env.CLIENT_URL || "http://localhost:3000"
    }/auth/resetpass/${resetToken}`;
    sendEmail({
      email,
      subject: "Reset Your Password",
      otp: RESET_PASSWORD_LINK,
      template: resetPassEmailTemp,
    });
    return responseHandler.success(
      res,
      200,
      {},
      "Find the reset password link in your email",
    );
  } catch (error) {
    return responseHandler.error(res, 500, error.message);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { token } = req.params;
    if (!newPassword)
      return responseHandler.error(res, 400, "New Password is required");
    if (!token) return responseHandler.error(res, 404, "Page not found");

    const hashedToken = hashResetToken(token);

    const existingUser = await userSchema.findOne({
      resetPassToken: hashedToken,
      resetExpire: { $gt: Date.now() },
    });

    if (!existingUser)
      return responseHandler.error(res, 400, "Invalid Request");

    existingUser.password = newPassword;
    existingUser.resetPassToken = undefined;
    existingUser.resetExpire = undefined;
    await existingUser.save();

    return responseHandler.success(
      res,
      200,
      {},
      "Password updated successfylly",
    );
  } catch (error) {
    return responseHandler.error(res, 500, error.message);
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userProfile = await userSchema
      .findById(req.user._id)
      .select(
        "-password -otp -otpExpires -resetPassToken -resetExpire -updatedAt",
      );
    if (!userProfile) return responseHandler.error(res, 400, "Invalid Request");

    return responseHandler.success(res, 200, userProfile, "User Profile");
  } catch (error) {
    return responseHandler.error(res, 500, error.message);
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { fullName, phone, address } = req.body;
    const userId = req.user._id;
    const avatar = req.file;

    const user = await userSchema
      .findById(userId)
      .select(
        "-password -otp -otpExpires -resetPassToken -resetExpire -updatedAt",
      );

    if (avatar && user.avatar) {
      const imgPublicId = user.avatar.split("/").pop().split(".")[0];
      await deleteFromCloudinary(`avatar/${imgPublicId}`);
      const imgRes = await uploadToCloudinary(avatar, "avatar");
      user.avatar = imgRes.secure_url;
    } else if (avatar && !user.avatar) {
      const imgRes = await uploadToCloudinary(avatar, "avatar");
      user.avatar = imgRes.secure_url;
    }
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();
    return responseHandler.success(res, 201, user, "User Profile Updated");
  } catch (error) {
    return responseHandler.error(res, 500, error.message);
  }
};

const signOutUser = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      path: "/",
      sameSite: isProduction ? "None" : "Lax",
    };
    res.clearCookie("X-AS-Token", cookieOptions);
    res.clearCookie("X-RF-Token", cookieOptions);
    return responseHandler.success(res, 200, {}, "Logged out successfully");
  } catch (error) {
    return responseHandler.error(res, 500, error.message);
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken =
      req.cookies?.["X-RF-Token"] || req.headers.authorization;
    if (!refreshToken) {
      return responseHandler.error(res, 401, "Refresh token missing");
    }
    // 2. Verify refresh token
    const decoded = verifyToken(refreshToken);
    if (!decoded) return responseHandler.error(res, 401, "Invalid token");
    const accessToken = generateAccessToken(decoded);

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("X-AS-Token", accessToken, {
      httpOnly: true,
      secure: isProduction,
      path: "/",
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 3600000,
    });
    return responseHandler.success(
      res,
      200,
      {},
      "Token refreshed successfully",
    );
  } catch (error) {
    console.error("Refresh token error:", error);
    return responseHandler.error(res, 500, error.message);
  }
};

module.exports = {
  signupUser,
  verifyOtp,
  resendOTP,
  signInUser,
  signOutUser,
  forgatePass,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  refreshAccessToken,
};
