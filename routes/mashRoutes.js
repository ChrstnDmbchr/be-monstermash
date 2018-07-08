const router = require('express').Router();
const mashController = require('../controllers/mashController');

const checkAuth = require('../middleware/checkAuth');

router.get("/all", mashController.getAll);

router.get("/getmash/:mashid", mashController.getByID)

router.post("/newmash", checkAuth, mashController.postNewMash);

router.get("/continuemash", checkAuth, mashController.getOldest);

router.post("/continuemash/:id", checkAuth, mashController.postContinueMash);

module.exports = router;