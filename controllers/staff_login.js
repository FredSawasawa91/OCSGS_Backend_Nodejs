require('dotenv').config();
const Staff = require('../models/staff');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

// Login route
exports.staff_login = (req, res, next) => {
    const email = req.body.email;
    const password = md5(req.body.password);

    Staff.findOne({
        where: {
            role: 'admin'
        }
    }).then( staff => {

        if(!staff) {
            Staff.create({
                fullname: 'admin',
                email: 'admin@admin.com',
                password: md5('1234'),
                role: 'admin'
            }).then(result => {
                console.log(`Admin account added`);
                res.status(201).json({
                    message: `Admin account added. Please login and change account details`,
                    staff: result
                });
            }).catch(err => {
                console.log(err);
            });
        } else {

            Staff.findOne({
                where: {
                    email: email,
                    password: password
                  }
            }).then( staff => {
                
                if (!staff) {
                    return res.status(401).json({ success: 0, message: 'Invalid email or password' });
                }
                
                const access_token_key = process.env.ACCESS_TOKEN_SECRET_KEY;
        
                // Generate a JWT token with id and name included in the payload
                const token = jwt.sign({id: staff.id, fullname: staff.fullname, role: staff.role}, access_token_key);
        
                // User authenticated successfully
                return res.status(200).json({ success: 1, message: 'Login successful', fullname: staff.fullname, role: staff.role, token: token });
        
            }).catch(err => console.log(err));

        }

    })

}