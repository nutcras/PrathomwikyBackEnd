const { Pool } = require('pg'); // เรียกใช้งาน pg module

// กำหนดการเชื่อมต่อฐานข้อมูล
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
// ทำการเชื่อมต่อกับฐานข้อมูล
pool.connect((err, client, release) => {
  if (err) {
    // กรณีเกิด error
    return console.error('Error acquiring client', err.stack)
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    console.log('Connected to PostgreSQL database at:', result.rows[0].now);
  })
})

module.exports = pool;
