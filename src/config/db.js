require("dotenv").config({
    path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"
  });
  
  const { Pool } = require("pg");
  
  const pool = new Pool(
    process.env.DATABASE_URL
      ? {
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }
        }
      : {
          user: process.env.DB_USER,
          host: process.env.DB_HOST,
          database: process.env.DB_DATABASE,
          password: process.env.DB_PASSWORD,
          port: process.env.DB_PORT
        }
  );
  
  module.exports = pool;
  