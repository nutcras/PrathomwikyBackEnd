const validate_req = require('../models/validate_req.models')
const database = require('../models/query_code')


exports.create = async (req, res) => {
  // ดึงข้อมูลจาก request
  const {
    imageName,
    imagelink,
    tagId
  } = req.body
  if (validate_req(req, res, [imageName, imagelink, tagId])) return
  // คำสั่ง SQL
  const sql = `INSERT INTO image ( imagename, imagelink,  tagId)
  VALUES ($1, $2, $3, $4);`;
const values = [imagename, imagelink,  tagId];

await database.create(sql, values, async (err, data) => {
  if (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred.',
    });
  } else {
    // data.token = await sign({ id: data.id }, '3d');  
    res.send("create success")
  }
});

}

exports.findAll = async (req, res) => {
  // คำสั่ง SQL
  const sql = `SELECT * FROM image ORDER BY
  imageId ASC;`
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

exports.findById = async (req, res) => {
  // คำสั่ง SQL
  const { id } = req.params
  const sql = `SELECT * FROM image WHERE imageId = ${id}`
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
  const {imageName, imageLink,  tagId} = req.body
  // ดึงข้อมูลจาก params
  const { id } = req.params
  // ตรวจสอบความถูกต้อง request
  if (validate_req(req, res, [id])) return
  // // คำสั่ง SQL
  const sql = 'UPDATE image SET imagename = $1, imagelink = $2, imagedesc = $3, adminid = $4 WHERE imageId = $5';
  // // ข้อมูลที่จะแก้ไขโดยเรียงตามลำดับ เครื่องหมาย ?
  const data = [imageName, imageLink,  tagId, id]
  // // แก้ไขข้อมูล โดยส่งคำสั่ง SQL เข้าไป
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
  const sql = `DELETE FROM image WHERE imageId = $1`
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


