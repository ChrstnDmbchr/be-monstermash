const router = require('express').Router();
const mashController = require('../controllers/mashController');

const checkAuth = require('../middleware/checkAuth');

router.get("/", checkAuth, mashController.getOldest);

router.get("/all", mashController.getAll);

router.post("/newmash", checkAuth, mashController.postNewMash);

router.post("/continuemash", checkAuth, mashController.postContinueMash);

module.exports = router;