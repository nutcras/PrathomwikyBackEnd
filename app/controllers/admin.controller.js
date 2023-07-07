const validate_req = require('../models/validate_req.models')
const database = require('../models/query_code')
const { verifyingHash, hashPassword } = require('../models/hashing.models')
const { sign, generateRandomKey } = require('../models/middleware.models')


exports.create = async (req, res) => {
  // ดึงข้อมูลจาก request
  const {
    name,
    surname,
    email,
    password
  } = req.body
  if (validate_req(req, res, [email, password])) return
  // คำสั่ง SQL
  const sql = `INSERT INTO admin (adminid, adminname, adminsurname, adminemail, adminpassword)
  VALUES ($1, $2, $3, $4, $5);`;
const values = [generateRandomKey(),name, surname, email, hashPassword(password)];

await database.create(sql, values, async (err, data) => {
  if (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred.',
    });
  } else {
    res.send("create success")
  }
});

}

exports.findAdmin = async (req, res) => {
  // คำสั่ง SQL
  const sql = `SELECT * FROM admin ORDER BY
  adminId ASC;`
  // ดึงข้อมูล โดยส่งคำสั่ง SQL เข้าไป
  await database.get(sql, (err, data) => {
    if (err)
      res.status(err.status).send({
        message: err.message || 'Some error occurred.',
      })
    else if (data) {
      res.status(200).json(data.rows)
    } else res.status(204).end()
  })
}

exports.findAdminById = async (req, res) => {
  // คำสั่ง SQL
  const { id } = req.params
  const sql = `SELECT * FROM admin WHERE adminId = ${id}`
  // ดึงข้อมูล โดยส่งคำสั่ง SQL เข้าไป
  await database.get(sql, (err, data) => {
    if (err)
      res.status(err.status).send({
        message: err.message || 'Some error occurred.',
      })
    else if (data) {
      if(data.rows.length == 0){
        res.send("NOTFOUND")
      }else{
        res.status(200).json(data.rows)
      }
    } else res.status(204).end()
  })
}

exports.update = async (req, res) => {
  // ดึงข้อมูลจาก request
  const {name,surname,email} = req.body
  // ดึงข้อมูลจาก params
  const { id } = req.params
  // ตรวจสอบความถูกต้อง request
  if (validate_req(req, res, [id])) return
  const sql = 'UPDATE admin SET adminName = $1, adminSurname = $2, adminEmail = $3 WHERE adminId = $4';
  const data = [name, surname, email, id]
  await database.update(sql, data, (err) => {
    if (err)
      res.status(err.status).send({
        message: err.message || 'Some error occurred.',
      })
    else {
      res.send("UPDATESUCCESS")
     res.status(204)
    }
  })
}

exports.deleteOne = async (req, res) => {
  // ดึงข้อมูลจาก params
  const { id } = req.params
  // ตรวจสอบความถูกต้อง request
  if (validate_req(req, res, [id])) return
  // คำสั่ง SQL
  const sql = `DELETE FROM admin WHERE adminId = $1`
  // ข้อมูลที่จะแก้ไขโดยเรียงตามลำดับ เครื่องหมาย ?
  const data = [id]
  // ลบข้อมูล โดยส่งคำสั่ง SQL และ id เข้าไป
  await database.delete(sql, data, (err, data) => {
    if (err)
      res.status(err.status).send({
        message: err.message || 'Some error occurred.',
      })
    else{
      res.send("DELETESUCCESS")
      res.status(204)
    }
  })
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  if (validate_req(req, res[(email, password)])) return

  const sql = `SELECT * FROM admin WHERE adminEmail = '${email}'`

  await database.get(sql, async (err, data) => {
    if (err)
      res.status(err.status).send({
        message: err.message || 'Some error occurred.',
      })
    else if (data.rows[0] && verifyingHash(password, data.rows[0].adminpassword)) {
      data.rows[0].token = await sign({ id: data.rows[0].adminId }, '2d')
      delete data.rows[0].adminpassword
      res.status(200).json(data.rows[0])
    } else res.status(204).end()
    
  })
}
