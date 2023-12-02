const controller = require('../controllers/staff');
const router = require('express').Router();
const auth = require('../middlewares/staff_auth');

router.post('/', auth, controller.createStaff); //Create Staff
router.get('/', auth, controller.getStaff) //Get all staff
router.get('/:role', auth, controller.getStaffByRole); //Get staff by role
router.get('/staff/byid', auth, controller.getStaffById); //Get staff by id
router.put('', auth, controller.updateStaff); //Update staff
router.delete('/:staff_id', auth, controller.deleteStaff); //Delete staff


module.exports = router;