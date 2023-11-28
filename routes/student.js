const controller = require('../controllers/student');
const router = require('express').Router();
const auth = require('../middlewares/student_auth');

router.post('/', controller.createStudent); //Create Student
router.put('/:student_id', auth, controller.updateStudent); //Update student


module.exports = router;