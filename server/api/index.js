const router = require('express').Router();

router.use('/channel', require('./channel'));
router.use('/genre', require('./genre'));
router.use('/episode', require('./episode'));
router.use('/podcast', require('./podcast'));
router.use('/users', require('./users'));
router.use('/keywords', require('./keywords'));

router.use((req, res, next) => {
	const error = new Error('Not Found');
	error.status = 404;
	next(error);
});

module.exports = router;
