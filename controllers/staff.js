const Staff = require('../models/staff');
const md5 = require('md5');

//GELL ALL STAFF/USERS
exports.getStaff = (req, res, next) => {

    const user = req.role;

    if(user != 'admin'){
        return res.status(401).json({message: 'This user account is not allowed to perfom this action'})
    }

    Staff.findAll().then( staff => {
        res.status(200).json({
            staff: staff});
    }).catch(err => console.log(err));
}

//GET ALL USERS/STAFF BY ROLE
exports.getStaffByRole = (req, res, next) => {
    const role = req.params.role;
    Staff.findAll({
        where: {
            role: role
        }
    }).then( staff => {
        res.status(200).json({
            staff: staff});
    }).catch(err => console.log(err));
}

//GET USERS/STAFF BY ID
exports.getStaffById = (req, res, next) => {
    const id = req.id;
    Staff.findOne({
        where: {
            id: id
        }
    }).then( staff => {
        res.status(200).json({
            staff: staff});
    }).catch(err => console.log(err));
}

//GET USERS/STAFF BY ID
exports.getUserById = (req, res, next) => {
    const id = req.params.id;

    if (req.role !='admin') {
        return res.status(401).json({ message: 'Not Authorised'})
    }
    Staff.findOne({
        where: {
            id: id
        }
    }).then( staff => {
        res.status(200).json({
            staff: staff});
    }).catch(err => console.log(err));
}

//REGISTER STAFF
exports.createStaff = (req, res, next) => {
    
    const fullname = req.body.fullname;
    const email = req.body.email;
    const role = req.body.role;
    const password = req.body.password;

    //Check if user is admin
    if (req.role != 'admin'){
        return res.status(400).json({message: 'This User account cant perfom this action'});
    }

    //Check if pin has 4 characters
    if (password.toString().length < 4){
        return res.status(400).json({message: 'Password must have atleast 4 characters'});
    }

    Staff.create({
        fullname: fullname,
        email: email,
        password: md5(password),
        role: role
    }).then(result => {
        console.log(`${result.fullname} added successfully`);
        res.status(201).json({
            success: 1,
            message: `${result.fullname} added successfully`,
            staff: result
        });
    }).catch(err => {
        console.log(err);
    });
}

//UPDATE STAFF
exports.updateStaff = (req, res, next) => {
    
    const staff_id = req.id;
    const fullname = req.body.fullname;
    const email = req.body.email;
    const role = req.body.role;
    const password = md5(req.body.password);
    
    Staff.findByPk(staff_id).then(staff => {
        if (!staff) {
            return res.status(404).json({ message: 'User not found'});
        }
        
        staff.fullname = fullname;
        staff.email = email;
        staff.role = role
        staff.password = password

        return staff.save();

    }).then(result => {
        res.status(200).json({message: `${result.fullname} updated`, staff: result});
    }).catch(err => console.log(err));
}

//UPDATE STAFF (Admin update user)
exports.editUser = (req, res, next) => {
    
    const staff_id = req.params.id;
    const fullname = req.body.fullname;
    const email = req.body.email;
    const role = req.body.role;
    const password = md5(req.body.password);
    
    if(req.role != 'admin'){
        return res.status(401).json({message: 'Not Authorised'})
    }

    Staff.findByPk(staff_id).then(staff => {
        if (!staff) {
            return res.status(404).json({ message: 'User not found'});
        }
        
        staff.fullname = fullname;
        staff.email = email;
        staff.role = role
        staff.password = password

        return staff.save();

    }).then(result => {
        res.status(200).json({message: `${result.fullname} updated`, staff: result});
    }).catch(err => console.log(err));
}

//DELETE STAFF
exports.deleteStaff = (req, res, next) => {
    const staff_id = req.params.staff_id;

    //Check if user is admin
    if (req.role != 'admin'){
        return res.status(400).json({message: 'This User account cant perfom this action'});
    }

    Staff.findByPk(staff_id).then(staff => {
        if (!staff) {
            return res.status(404).json({message: 'User not found'});
        }
        return Staff.destroy({
            where: {
                id: staff_id
            }
        });
    }).then(result => {
        res.status(200).json({message: 'User deleted'});
    }).catch(err => console.log(err));
}