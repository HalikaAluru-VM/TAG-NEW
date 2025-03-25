const AdminRepository = require("../repositories/adminRepository");

const validateUserByEmail = async (email) => {
  const user = await AdminRepository.findByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

module.exports = { validateUserByEmail };