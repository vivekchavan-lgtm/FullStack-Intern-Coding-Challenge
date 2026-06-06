const express = require("express");
const router = express.Router();

const ratingController =
require("../controllers/ratingController");

const verifyToken =
require("../models/authMiddleware");

router.post(
  "/",
  verifyToken,
  ratingController.addRating
);
router.put(
  "/:storeId",
  verifyToken,
  ratingController.updateRating
);
router.get(
  "/my",
  verifyToken,
  ratingController.getMyRatings
);

module.exports = router;