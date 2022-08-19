var express = require("express");
var router = express.Router();
var { createUser, getAllUser } = require("../controllers/users.controller");

router.post("/", createUser);
router.get("/", getAllUser);

module.exports = router;
