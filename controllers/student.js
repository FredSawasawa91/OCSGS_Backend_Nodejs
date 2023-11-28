const Student = require('../models/student');
const md5 = require('md5');

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
    
    const student_id = req.params.student_id;
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
        student.password = password

        return student.save();

    }).then(result => {
        res.status(200).json({success: 1, message: `${result.fullname} updated`, student: result});
    }).catch(err => console.log(err));
}