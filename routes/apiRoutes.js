const router = require('express').Router();

const userRoutes = require('./userRoutes');
const mashRoutes = require('./mashRoutes');

router.get('/', (req, res, next) => {
  res.status(200).send({
    status: 'OK'
  });
});

router.use("/user", userRoutes);
router.use("/mash", mashRoutes);

module.exports = router;