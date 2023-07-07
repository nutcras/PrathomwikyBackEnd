module.exports = (app) => {
  const router = require('express').Router()
  const multer = require("multer");
  const upload = multer();

  const {
    create,
    findAll,
    update,
    deleteOne,
    findById,
  } = require('../controllers/tag.controller.js')

  router.post('/', upload.single("file"),  create)

  router.get('/getAll', findAll)
  router.get('/get/:id',  findById)
 
  router.put('/:id', upload.single("file"), update)

  router.delete('/:id',  deleteOne)


  // เซ็ต PREFIX
  app.use(process.env.PREFIX + '/tag', router)
}
