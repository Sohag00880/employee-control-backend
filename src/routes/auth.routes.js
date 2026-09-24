const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const { authenticate, requireRole } = require("../middlewares/auth.middleware");

router.post("/register", authenticate, requireRole("admin"), controller.register);
router.post("/login", controller.login);
router.get("/me", authenticate, controller.me);
router.post("/logout", authenticate, controller.logout);

module.exports = router;