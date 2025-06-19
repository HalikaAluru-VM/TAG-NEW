const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://retool:npg_AG6eF7EatqZI@ep-steep-scene-a6abdzu6.us-west-2.retooldb.com/retool?sslmode=require",
});

module.exports = pool;
