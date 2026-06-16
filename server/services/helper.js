const generateOTP = () => {
  // Generates a random integer between 1000 and 9999
  return Math.floor(1000 + Math.random() * 9000);
};

// console.log(generateOTP());
module.exports = { generateOTP };
