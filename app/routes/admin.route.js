module.exports = (app) => {
  const router = require('express').Router()
  const { verify } = require('../models/middleware.models.js')
  const multer  = require('multer')

  const {
    create,
    findAdmin,
    update,
    deleteOne,
    login,
    findAdminById,
  } = require('../controllers/admin.controller.js')

  router.post('/', create)

  router.get('/getAll', findAdmin)
  router.get('/get/:id', findAdminById)
 
  router.put('/:id', update)

  router.delete('/:id', deleteOne)

  router.post('/login', login)

  // เซ็ต PREFIX
  app.use(process.env.PREFIX + '/admin', router)
}
