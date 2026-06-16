const { default: mongoose } = require("mongoose");

const isValidId = (ids) => {
  if (!Array.isArray(ids)) {
    return mongoose.Types.ObjectId.isValid(String(ids));
  }

  return ids.every((id) => mongoose.Types.ObjectId.isValid(String(id)));
};

module.exports = isValidId;
