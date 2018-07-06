const router = require('express').Router();
const userController = require('../controllers/userController');

const checkAuth = require('../middleware/checkAuth');

router.get("/", checkAuth, userController.getUser);

router.post("/signin", userController.signUserIn);

router.post("/signup", userController.signUserUp);

module.exports = router;