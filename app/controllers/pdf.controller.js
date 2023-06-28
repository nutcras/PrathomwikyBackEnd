const validate_req = require("../models/validate_req.models");
const database = require("../models/query_code");
const options = { timeZone: 'Asia/Bangkok' };

exports.create = async (req, res) => {
  // ดึงข้อมูลจาก request
  const { pdfName, adminId } = req.body;

  const file = req.file;

  const createDate = new Date(); // Current date and time
  const formattedCreateDate = createDate.toLocaleString('en-US', options);

  if (validate_req(req, res, [file, adminId])) return;
  // คำสั่ง SQL
  const sql = `INSERT INTO pdf ( path, pdfname, adminid, createdate) VALUES ($1, $2, $3, $4);`;
  const values = [file.buffer, pdfName, adminId, formattedCreateDate];

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
  const sql = `SELECT * FROM pdf ORDER BY createdate ASC;`;
  // ดึงข้อมูล โดยส่งคำสั่ง SQL เข้าไป
  await database.get(sql, (err, data) => {
    if (err)
      res.status(err.status).send({
        message: err.message || "Some error occurred.",
      });
    else if (data) {
      const convertedData = data.rows.map((row) => {
        const createDate = new Date(row.createdate);
        const formattedCreateDate = createDate.toLocaleString('en-US', options);
        return { ...row, createdate: formattedCreateDate };
      });

      res.status(200).json(convertedData);
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
        const convertedData = data.rows.map((row) => {
          const createDate = new Date(row.createdate);
          const formattedCreateDate = createDate.toLocaleString('en-US', options);
          return { ...row, createdate: formattedCreateDate };
        });
  
        res.status(200).json(convertedData);
      }
    } else res.status(204).end();
  });
};

exports.update = async (req, res) => {
  // ดึงข้อมูลจาก request
  const { pdfName, adminId } = req.body;
  const file = req.file;
  // ดึงข้อมูลจาก params
  const { id } = req.params;
  // ตรวจสอบความถูกต้อง request
  if (validate_req(req, res, [id, file])) return;
  const createDate = new Date(); // Current date and time
  const formattedCreateDate = createDate.toLocaleString('en-US', options);
  // // คำสั่ง SQL
  const sql =
    "UPDATE pdf SET pdfname = $1, path = $2, adminid = $3, createdate =$4 WHERE id = $5";
  // // ข้อมูลที่จะแก้ไขโดยเรียงตามลำดับ เครื่องหมาย ?
  const data = [pdfName, file.buffer, adminId, formattedCreateDate, id];
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
