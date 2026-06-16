const userSchema = require('../models/userSchema');
const { responseHandler } = require('../services/responseHandler');

const getAllUsers = async (req, res) => {
  try {
    const users = await userSchema
      .find()
      .select('-password -otp -otpExpires -resetPassToken -resetExpire')
      .sort({ createdAt: -1 });
    return responseHandler.success(res, 200, { users, total: users.length }, 'Users fetched successfully');
  } catch (error) {
    return responseHandler.error(res, 500, error.message);
  }
};

module.exports = { getAllUsers };
