var express = require("express");
var router = express.Router();
var { createUser, getAllUser, deleteUser, updateUser } = require("../controllers/users.controller");

router.post("/", createUser);
router.get("/", getAllUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
