const router = require("express").Router();
const controller = require("../controllers/monitoring.controller");
const { authenticate, requireRole } = require("../middlewares/auth.middleware");

router.use(authenticate, requireRole("admin"));

router.post("/start", controller.start);
router.post("/stop/:sessionId", controller.end);
router.get("/sessions", controller.list);

module.exports = router;