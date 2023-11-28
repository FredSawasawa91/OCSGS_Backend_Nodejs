const controller = require('../controllers/student_login');
const router = require('express').Router();

//STUDENT LOGIN ROUTE
router.post('/', controller.student_login);

module.exports = router;