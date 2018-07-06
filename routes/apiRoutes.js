const router = require('express').Router();

const userRoutes = require('./userRoutes');
const mashRoutes = require('./mashRoutes')

router.use("/user", userRoutes);
router.use("/mash", mashRoutes);

module.exports = router;