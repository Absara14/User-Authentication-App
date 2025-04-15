const express= require("express");
const { login, signup, dashboard } = require("../controllers/auth.controller");
const authenticate  = require("../middlewares/auth.middleware");
const authorizeRole  = require("../middlewares/role.middleware");

const router= express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.get("/dashboard", authenticate, authorizeRole(["ADMIN", "CUSTOMER"]), dashboard);

module.exports=router;