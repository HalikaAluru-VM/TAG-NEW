const pool = require("../db/pool");

class UserRepository {
  static async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = UserRepository;