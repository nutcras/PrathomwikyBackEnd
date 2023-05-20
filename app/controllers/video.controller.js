const validate_req = require('../models/validate_req.models')
const database = require('../models/query_code')
const {v4: uuidv4} = require('uuid');

exports.create = async (req, res) => {
  // ดึงข้อมูลจาก request
  const {
    videoname,
    videolink,
    videodesc,
    typeId,
    adminId,
    listDetail
  } = req.body
  if (validate_req(req, res, [videoname, videolink, typeId, listDetail,  adminId])) return
  const videoId = uuidv4();
  // คำสั่ง SQL
  const sql = `INSERT INTO video (videoId, videoname, videolink, videodesc, typeId, adminId)
  VALUES ($1, $2, $3, $4, $5, $6);`;
const values = [videoId, videoname, videolink, videodesc, typeId, adminId];

await database.create(sql, values, async (err, data) => {
  if (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred.',
    });
  } else {
    // data.token = await sign({ id: data.id }, '3d');  
    res.send("create success")
    console.log(data);
  }
});

}

exports.findAll = async (req, res) => {
  // คำสั่ง SQL
  const sql = `SELECT v.*, vd.* FROM video v
  LEFT JOIN videoDetail vd
  ON vd.videoId = v.videoId
  ORDER BY
  videoId ASC;`
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
exports.findByType = async (req, res) => {

  const {typeId} = req.params
  // คำสั่ง SQL
  const sql = `SELECT v.*, vd.* FROM video v
  LEFT JOIN videoDetail vd
  ON vd.videoId = v.videoId
  WHERE v.typeId = ${typeId}
  ORDER BY
  videoId ASC;`
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
  const sql = `SELECT * FROM video WHERE videoId = ${id}`
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
  const {videoname, videolink, videodesc, adminid} = req.body
  // ดึงข้อมูลจาก params
  const { id } = req.params
  // ตรวจสอบความถูกต้อง request
  if (validate_req(req, res, [id])) return
  // // คำสั่ง SQL
  const sql = 'UPDATE video SET videoname = $1, videolink = $2, videodesc = $3, adminid = $4 WHERE videoId = $5';
  // // ข้อมูลที่จะแก้ไขโดยเรียงตามลำดับ เครื่องหมาย ?
  const data = [videoname, videolink, videodesc, adminid, id]
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
  const sql = `DELETE FROM video WHERE videoId = $1`
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


