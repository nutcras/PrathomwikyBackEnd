module.exports = (app) => {
  const router = require('express').Router()
  const { verify } = require('../models/middleware.models.js')
  const multer  = require('multer')
  const upload = multer()

  const {
    create,
    fineMentorCanWork,
    unconfirm,
    updateWorkRate,
    deleteOne,
    login,
    fineAvgRate,
  } = require('../controllers/mentor.controller')

  router.post('/',upload.single('photo'), create)

  router.get('/', verify, fineMentorCanWork)
  router.get('/unconfirm/', verify, unconfirm)
  router.get('/findAvg', fineAvgRate)
 

  router.put('/workRate/:id', updateWorkRate)

  router.delete('/:id', deleteOne)

  router.post('/login', login)

  // เซ็ต PREFIX
  app.use(process.env.PREFIX + '/mentor', router)
}
