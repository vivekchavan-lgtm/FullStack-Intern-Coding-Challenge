const express = require("express");
const router = express.Router();

const adminController =
require("../controllers/adminController");

const verifyToken =
require("../models/authMiddleware");

const authorize =
require("../middleware/roleMiddleware");

router.get(
  "/dashboard",
  verifyToken,
  authorize("ADMIN"),
  adminController.getDashboard
);
router.get(
  "/users",
  verifyToken,
  authorize("ADMIN"),
  adminController.getUsers
);
router.get(
  "/users",
  verifyToken,
  authorize("ADMIN"),
  adminController.searchUsers
);
module.exports = router;
