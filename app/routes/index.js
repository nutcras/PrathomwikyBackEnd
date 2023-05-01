module.exports = (app) => {
  // ดึงโค้ดมาเรียกแล้วส่งตัวแปร app ไปด้วย
  require('./video.route')(app)
  require('./admin.route')(app)
  require('./videodetail.route')(app)
  require('./image.route')(app)
  require('./tag.route')(app)
  
}
