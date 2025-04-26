// const express = require("express");
// const router = express.Router();
// const authenticateToken = require("../middleware/authMiddleware");
// const { updateProfile } = require("../controllers/userController");

// router.put("/update", authenticateToken, updateProfile);
// module.exports = router;

const express = require("express");
const router = express.Router();
const { updateProfile } = require("../controllers/userController");
const authenticateToken = require("../middleware/authMiddleware");

router.put("/users/update", authenticateToken, updateProfile);

module.exports = router;
