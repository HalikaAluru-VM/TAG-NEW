const pool = require("../db/pool");

// In-memory cache to store frequently accessed data
const cache = new Map();
const cacheExpiry = new Map();

// TTL is the time to live for a cache entry, which is the amount of time that the entry is considered valid before it expires and is removed from the cache.
const CACHE_TTL = 5 * 60 * 1000; // Cache expiry time in milliseconds (5 minutes)

const findByEmail = async (email) => {
  const now = Date.now();

  // Check if the email exists in the cache and is not expired
  if (cache.has(email) && cacheExpiry.get(email) > now) {
    console.log("Cache hit for email:", email);
    return cache.get(email);
  }

  console.time("Database Query Time");
  const result = await pool.query(
    "SELECT ec_mapping, status FROM admin_table WHERE email = $1",
    [email]
  );
  console.timeEnd("Database Query Time");

  const admin = result.rows[0];

  // Cache the result and set an expiry time
  if (admin) {
    cache.set(email, admin);
    cacheExpiry.set(email, now + CACHE_TTL);
  }

  return admin;
};

module.exports = { findByEmail };