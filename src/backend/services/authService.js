const AdminRepository = require("../repositories/adminRepositories");

const login = async (username, password) => {
  // Replace this with actual logic to validate the username and password
  if (username === "admin" && password === "admin") {
    return { username, role: "admin" };
  } else {
    throw new Error("Invalid username or password");
  }
};

const checkAdminAccess = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const admin = await AdminRepository.findByEmail(email);
  if (!admin) {
    throw new Error("User not available");
  }

  const { ec_mapping, status } = admin;

  if (status !== "Enable") {
    throw new Error("Account is disabled. Please contact admin.");
  }

  return { ec_mapping };
};

module.exports = { login, checkAdminAccess };