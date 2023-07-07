module.exports = (app) => {
  const router = require("express").Router();

  const {
    create,
    findAll
  } = require("../controllers/chat.controller.js");

  router.post("/", create);

  router.get("/getAll", findAll);

  app.use(process.env.PREFIX + "/chat", router);
};
