const isValidEmail = (email) => {
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
};

const isValidPass = (pass) => {
  //  const passwordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const passwordRegex = /^[a-z\d\W_]{8,}$/;

  return passwordRegex.test(pass);
};

module.exports = { isValidEmail, isValidPass };
