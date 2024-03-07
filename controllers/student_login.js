require('dotenv').config();
const Student = require('../models/student');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

// Login route
exports.student_login = (req, res, next) => {
    const email = req.body.email;
    const password = md5(req.body.password);

    Student.findOne({
        where: {
            email: email,
            password: password
          }
    }).then( student => {
        
        if (!student) {
            return res.status(401).json({ success: 0, message: 'Invalid email or password' });
        }
        
        const access_token_key = process.env.ACCESS_TOKEN_SECRET_KEY;

        // Generate a JWT token with id and name included in the payload
        const token = jwt.sign({id: student.id, student_number: student.student_number, student_name: student.fullname, program: student.program}, access_token_key);

        // User authenticated successfully
        return res.status(200).json({ success: 1, message: 'Login successful', student_name: student.fullname, token: token });

    }).catch(err => console.log(err));
}