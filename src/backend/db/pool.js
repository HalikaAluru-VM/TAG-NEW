const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://retool:4zBLlh1TPsAu@ep-frosty-pine-a6aqfk20.us-west-2.retooldb.com/retool?sslmode=require",
});

module.exports = pool;
