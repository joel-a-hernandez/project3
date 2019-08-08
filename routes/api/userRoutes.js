const router = require("express").Router();
const userController = require("../../controllers/userController");

// Matches with "/api/user"
router.route("/")
    .get(userController.findAll);

// Matches with "/api/user/:id"
router.route("/:userId")
  .get(userController.findById);

  // Matches with "/api/user/:email"
router.route("/:email")
.get(userController.findById);
module.exports = router;