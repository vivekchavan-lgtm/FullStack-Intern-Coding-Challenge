const express = require("express");
const router = express.Router();

const ownerController =
require("../controllers/ownerController");

const verifyToken =
require("../models/authMiddleware");

const authorize =
require("../middleware/roleMiddleware");

router.get(
  "/dashboard",
  verifyToken,
  authorize("OWNER"),
  ownerController.getOwnerDashboard
);
router.get(
  "/raters",
  verifyToken,
  authorize("OWNER"),
  ownerController.getRaters
);

module.exports = router;