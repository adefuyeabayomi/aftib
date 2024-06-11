const router = require("express").Router()

const { ping } = require("../controllers/ping")

router.get("/", ping)

module.exports = router

