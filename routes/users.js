var express = require("express");
var router = express.Router();
var { createUser, getAllUser, deleteUser } = require("../controllers/users.controller");

router.post("/", createUser);
router.get("/", getAllUser);
router.delete("/:id", deleteUser);

module.exports = router;
