const validate_req = require("../models/validate_req.models");
const database = require("../models/query_code");
const { generateRandomKey } = require("../models/middleware.models");

exports.create = async (req, res) => {
  // ดึงข้อมูลจาก request
  const { imageName,  imageDesc, adminId } = req.body;

  const file = req.file;
  if (validate_req(req, res, [imageName])) return;

  const createDate = new Date(); // Current date and time
  const formattedCreateDate = createDate.toISOString();

  const sql = `INSERT INTO image (imageid, imagename, path, imagedesc, adminid, createdate)
  VALUES ($1, $2, $3, $4, $5, $6);`;
  const values = [generateRandomKey(), imageName, file.buffer, imageDesc, adminId, formattedCreateDate];

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
  const sql = `SELECT imageid, imagename, encode(path, 'base64') as path_base64, imagedesc, createdate, adminid
  FROM image ORDER BY createdate ASC;`;
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
  const sql = `SELECT imageid, imagename,  encode(path, 'base64') as path_base64, imagedesc, createdate, adminid
  FROM image WHERE imageId = ${id}`;
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
  const { imageName,  imageDesc, adminId } = req.body;
  // ดึงข้อมูลจาก params
  const { id } = req.params;
  const file = req.file;
  // ตรวจสอบความถูกต้อง request
  if (validate_req(req, res, [id])) return;
  const createDate = new Date(); // Current date and time
  const formattedCreateDate = createDate.toISOString();
  const sql =
    "UPDATE image SET  imagename = $1,  imagedesc = $2, adminid = $3, path = $4, createdate = $5 WHERE imageid = $6";
  const data = [imageName, imageDesc, adminId, file.buffer, formattedCreateDate, id];
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
  const sql = `DELETE FROM image WHERE imageId = $1`;
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
