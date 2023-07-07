const validate_req = require("../models/validate_req.models");
const database = require("../models/query_code");
const { generateRandomKey } = require("../models/middleware.models");
const options = { timeZone: 'Asia/Bangkok' };

exports.create = async (req, res) => {
  // ดึงข้อมูลจาก request
  const { name, phone, msg } = req.body;
  if (validate_req(req, res, [name])) return;
  const createDate = new Date(); // Current date and time
  const formattedCreateDate = createDate.toLocaleString('en-US', options);
  // คำสั่ง SQL
  const sql = `INSERT INTO chat (id, name, numberphone,  msg, createdate) VALUES ($1, $2, $3, $4, $5);`;
  const values = [generateRandomKey(), name, phone, msg, formattedCreateDate];

  await database.create(sql, values, async (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred.",
      });
    } else {
      res.send("create success");
    }
  });
};

exports.findAll = async (req, res) => {
  // คำสั่ง SQL
  const sql = `SELECT id, name, numberphone as phone, msg, createdate FROM chat  ORDER BY createdate ASC;`;
  // ดึงข้อมูล โดยส่งคำสั่ง SQL เข้าไป
  await database.get(sql, (err, data) => {
    if (err)
      res.status(err.status).send({
        message: err.message || "Some error occurred.",
      });
    else if (data) {
      res.status(200).json(data.rows);
    } else res.status(204).end();
  });
};
