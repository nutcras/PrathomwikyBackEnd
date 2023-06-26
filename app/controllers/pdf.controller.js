const validate_req = require("../models/validate_req.models");
const database = require("../models/query_code");

exports.create = async (req, res) => {
  // ดึงข้อมูลจาก request
  const { pdfName, adminId } = req.body;

  const file = req.file;

  if (validate_req(req, res, [file, adminId])) return;
  // คำสั่ง SQL
  const sql = `INSERT INTO pdf ( path, pdfname, adminid) VALUES ($1, $2, $3);`;
  const values = [file.buffer, pdfName, adminId];

  await database.create(sql, values, async (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred.",
      });
    } else {
      // data.token = await sign({ id: data.id }, '3d');
      res.send("create success");
    }
  });
};

exports.findAll = async (req, res) => {
  // คำสั่ง SQL
  const sql = `SELECT * FROM pdf ORDER BY id ASC;`;
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

exports.findById = async (req, res) => {
  // คำสั่ง SQL
  const { id } = req.params;
  const sql = `SELECT * FROM pdf WHERE id = ${id}`;
  // ดึงข้อมูล โดยส่งคำสั่ง SQL เข้าไป
  await database.get(sql, (err, data) => {
    if (err)
      res.status(err.status).send({
        message: err.message || "Some error occurred.",
      });
    else if (data) {
      if (data.rows.length == 0) {
        res.send("NOTFOUND");
      } else {
        res.status(200).json(data.rows);
      }
    } else res.status(204).end();
  });
};

exports.update = async (req, res) => {
  // ดึงข้อมูลจาก request
  const { pdfName, adminId } = req.body;
  // ดึงข้อมูลจาก params
  const { id } = req.params;

  const file = req.file;
  // ตรวจสอบความถูกต้อง request
  if (validate_req(req, res, [id])) return;
  // // คำสั่ง SQL
  const sql =
    "UPDATE pdf SET pdfname = $1, path = $2, adminid = $3 WHERE id = $4";
  // // ข้อมูลที่จะแก้ไขโดยเรียงตามลำดับ เครื่องหมาย ?
  const data = [pdfName, file.buffer, adminId, id];
  // // แก้ไขข้อมูล โดยส่งคำสั่ง SQL เข้าไป
  await database.update(sql, data, (err) => {
    if (err)
      res.status(err.status).send({
        message: err.message || "Some error occurred.",
      });
    else {
      res.send("UPDATESUCCESS");
      res.status(204);
    }
  });
};

exports.deleteOne = async (req, res) => {
  // ดึงข้อมูลจาก params
  const { id } = req.params;
  // ตรวจสอบความถูกต้อง request
  if (validate_req(req, res, [id])) return;
  // คำสั่ง SQL
  const sql = `DELETE FROM pdf WHERE id = $1`;
  // ข้อมูลที่จะแก้ไขโดยเรียงตามลำดับ เครื่องหมาย ?
  const data = [id];
  // ลบข้อมูล โดยส่งคำสั่ง SQL และ id เข้าไป
  await database.delete(sql, data, (err, data) => {
    if (err)
      res.status(err.status).send({
        message: err.message || "Some error occurred.",
      });
    else {
      res.send("DELETESUCCESS");
      res.status(204);
    }
  });
};
