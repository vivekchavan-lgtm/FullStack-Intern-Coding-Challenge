const express = require("express");
const router = express.Router();

const storeController =
require("../controllers/storeController");

const verifyToken =
require("../models/authMiddleware");

const authorize =
require("../middleware/roleMiddleware");

router.post(
  "/",
  verifyToken,
  authorize("ADMIN"),
  storeController.createStore
);
router.get(
  "/",
  verifyToken,
  storeController.getStores
);

module.exports = router;