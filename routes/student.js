const controller = require('../controllers/student');
const router = require('express').Router();
const auth = require('../middlewares/student_auth');

router.post('/', controller.createStudent); //Create Student
router.get('/', auth, controller.getStudent);
router.get('/cleared_students', auth, controller.getClearedStudents)
router.get('/cleared_students_by_type', auth, controller.getClearedStudentsByType)
router.put('/', auth, controller.updateStudent); //Update student


module.exports = router;