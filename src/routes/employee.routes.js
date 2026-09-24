const router = require("express").Router();
const controller = require("../controllers/employee.controller");
const { authenticate, requireRole } = require("../middlewares/auth.middleware");

router.use(authenticate, requireRole("admin"));

router.post("/", controller.create);
router.get("/", controller.list);
router.get("/:id", controller.getOne);
router.patch("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;