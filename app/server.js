module.exports = () => {
  const express = require('express')
  const dotenv = require('dotenv')
  const cors = require('cors');
  
  dotenv.config()
  const app = express()

  app.use(cors());
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))


  // หน้าแรกจะแสดงคำยอดฮิต
  app.get('/', (req, res) => {
    return res.send('<h1>API Prathomwiky CONNECT!!</h1>')
  })

  // ดึงโค้ดมาเรียกแล้วส่งตัวแปร app ไปด้วย
  require('./routes/index')(app)

  // หน้าใดๆ ก็ตามที่ไม่มีการเรียกก่อนหน้าจะส่ง error 404 พร้อมแสดงคำขนาดใหญ่
  app.get('*', (req, res) => {
    return res.status(404).send('<h1>Error 404 Not found</h1>')
  })

  // เซ็ต port
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`
      ***************************
            Sever Run Succeed
            Port: ${PORT}
      ***************************
`)
  })
}
