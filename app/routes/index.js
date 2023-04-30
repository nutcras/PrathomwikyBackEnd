module.exports = (app) => {
  // ดึงโค้ดมาเรียกแล้วส่งตัวแปร app ไปด้วย
  require('./video.route')(app)
  require('./admin.route')(app)
  
}
