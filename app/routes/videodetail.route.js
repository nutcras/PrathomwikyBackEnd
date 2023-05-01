module.exports = (app) => {
  const router = require('express').Router()
  const { verify } = require('../models/middleware.models.js')

  const {
    create,
    findAll,
    update,
    deleteOne,
    findById,
  } = require('../controllers/videodetail.controller.js')

  router.post('/',  create)

  router.get('/getAll', findAll)
  router.get('/get/:id',  findById)
 
  router.put('/:id',update)

  router.delete('/:id',  deleteOne)


  // เซ็ต PREFIX
  app.use(process.env.PREFIX + '/videodetail', router)
}
