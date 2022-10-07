const express = require("express")
const router = express.Router()
const apiController = require("../controllers/apiController") 

router.use("/users/:_id/exercises", apiController.excercises)
router.use("/users/:_id/logs", apiController.logs)
router.use("/users", apiController.users)

module.exports = router