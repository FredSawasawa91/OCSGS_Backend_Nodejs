const controller = require('../controllers/staff_login');
const router = require('express').Router();

//STAFF LOGIN ROUTE
router.post('/', controller.staff_login);

module.exports = router;