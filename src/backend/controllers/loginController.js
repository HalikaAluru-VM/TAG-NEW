const LoginService = require("../services/loginService");

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await LoginService.login(username, password);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { login };