const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // Enable automatic reconnection
  idleTimeoutMillis: 1000, // Close idle clients after 1 second of inactivity
  connectionTimeoutMillis: 5000, // Wait 5 seconds while trying to connect before timing out
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

const connectWithRetry = () => {
  console.log("Attempting to connect to PostgreSQL database...");
  pool.connect((err, client, release) => {
    if (err) {
      console.error("Error acquiring client", err.stack);
      setTimeout(connectWithRetry, 2000); // Retry after 2 seconds
      return;
    }

    client.query("SELECT NOW()", (err, result) => {
      release();
      if (err) {
        console.error("Error executing query", err.stack);
        setTimeout(connectWithRetry, 2000); // Retry after 2 seconds
        return;
      }
      console.log("Connected to PostgreSQL database at:", result.rows[0].now);
    });
  });
};

connectWithRetry();

module.exports = pool;
