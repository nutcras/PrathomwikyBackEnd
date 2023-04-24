module.exports = (app) => {
  // ดึงโค้ดมาเรียกแล้วส่งตัวแปร app ไปด้วย
  require('./mentor.route')(app)
  require('./admin.route')(app)
  
}
