const Student = require('../models/student');
const { QueryTypes } = require('sequelize');
const sequelize = require('../utils/db');
const md5 = require('md5');

//GET ONE STUDENT
exports.getStudent = (req, res, next) => {
    const id = req.id;

    Student.findOne({
        where: {
            id: id
        }
    }).then( student => {
        res.status(200).json({
            student: student});
    }).catch(err => console.log(err));
}

//GET ALL STUDENTS WHO HAVE BEEN CLEARED IN ALL 4 SERVICES
exports.getClearedStudents = (req, res, next) => {

    let sql = `SELECT student_number, fullname, program FROM students WHERE students.id IN ( SELECT student_id FROM clearance_requests WHERE status = 'approved' GROUP BY student_id HAVING COUNT(DISTINCT type) = 4 )`

    sequelize.query(sql, {type: QueryTypes.SELECT}).then( Students => {
        res.status(200).json({
            success: 1,
            Students: Students});
    }).catch(err => console.log(err));
}

//GET ALL STUDENTS WHO HAVE BEEN CLEARED IN ALL A PARTICULAR SERVICE
exports.getClearedStudentsByType = (req, res, next) => {
    const service_type = req.role;

    let sql = `SELECT clearance_requests.type, clearance_requests.status, students.student_number, students.fullname as student_fullname, students.email as student_email, students.program FROM clearance_requests LEFT OUTER JOIN students on clearance_requests.student_id = students.id WHERE clearance_requests.type = '${service_type}' AND clearance_requests.status = 'approved'`

    sequelize.query(sql, {type: QueryTypes.SELECT}).then( Students => {
        res.status(200).json({
            success: 1,
            Students: Students});
    }).catch(err => console.log(err));
}

//REGISTER STUDENT
exports.createStudent = (req, res, next) => {
    
    const fullname = req.body.fullname;
    const student_number = req.body.student_number;
    const email = req.body.email;
    const program = req.body.program;
    const password = req.body.password;

    //Check if pin has 4 characters
    if (password.toString().length < 4){
        return res.status(400).json({message: 'Password must have atleast 4 characters'});
    }

    Student.create({
        fullname: fullname,
        student_number: student_number,
        email: email,
        program: program,
        password: md5(password)
    }).then(result => {
        console.log(`${result.fullname} registered successfully`);
        res.status(201).json({
            success: 1,
            message: `${result.fullname} registered successfully`,
            student: result
        });
    }).catch(err => {
        console.log(err);
    });
}

//UPDATE STUDENT
exports.updateStudent = (req, res, next) => {
    
    const student_id = req.id;
    const fullname = req.body.fullname;
    const student_number = req.body.student_number;
    const email = req.body.email;
    const program = req.body.program;
    const password = req.body.password;
    
    Student.findByPk(student_id).then(student => {
        if (!student) {
            return res.status(404).json({ message: 'Student not found'});
        }
        
        student.student_number = student_number;
        student.fullname = fullname;
        student.email = email;
        student.program = program
        student.password = md5(password)

        return student.save();

    }).then(result => {
        res.status(200).json({success: 1, message: `${result.fullname} updated`, student: result});
    }).catch(err => console.log(err));
}