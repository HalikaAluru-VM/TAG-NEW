const loginService = require("../services/loginService");
const AdminRepository = require("../repositories/adminRepository");

const login = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await loginService.validateUserByEmail(email);
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const checkAdmin = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    console.log("Received email:", email); // Debugging log
    const admin = await AdminRepository.findByEmail(email);

    if (!admin) {
      console.log("Admin not found for email:", email); // Debugging log
      return res.status(404).json({ error: "User not available" });
    }

    const { ec_mapping, status } = admin;
    console.log("Admin details:", { ec_mapping, status }); // Debugging log

    if (status !== "Enable") {
      console.log("Account is disabled for email:", email); // Debugging log
      return res.status(403).json({ error: "Account is disabled. Please contact admin." });
    }

    res.json({ ec_mapping });
  } catch (error) {
    console.error("Error in checkAdmin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { login, checkAdmin };