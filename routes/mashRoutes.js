const router = require('express').Router();
const mashController = require('../controllers/mashController');

const checkAuth = require('../middleware/checkAuth');

router.get("/all", mashController.getAll);

router.get("/getmash/:mashid", mashController.getByID)

router.get("/continuemash", checkAuth, mashController.getOldest);

router.post("/newmash", checkAuth, mashController.postNewMash);

router.post("/continuemash", checkAuth, mashController.postContinueMash);

module.exports = router;