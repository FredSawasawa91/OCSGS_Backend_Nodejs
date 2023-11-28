const controller = require('../controllers/clearance');
const router = require('express').Router();
const staff_auth = require('../middlewares/staff_auth');
const student_auth = require('../middlewares/student_auth');


router.post('/', student_auth, controller.createClearance); //Create clearance
router.get('/student', student_auth, controller.getClearancesByStudentId) //Get all student clearance request
router.put('/student/:id', student_auth, controller.updateClearance); //Update clearance


router.get('/staff', staff_auth, controller.getClearancesByType); //Get clearance by type
router.get('/staff/status/:status', staff_auth, controller.getClearancesByTypeAndStatus); //Get staff by type and status
router.put('/staff/:id', staff_auth, controller.clearanceAction); //Aprove reject request
//router.delete('/:staff_id', auth, controller.deleteStaff); //Delete staff


module.exports = router;