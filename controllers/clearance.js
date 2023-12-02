const { QueryTypes } = require('sequelize');
const Clearance = require('../models/clearance');
const Clearance_tracking = require('../models/clearance_tracking');
const sequelize = require('../utils/db');
const nodemailer = require('nodemailer');
require('dotenv').config();


///////////////////////////// STUDENT CONTROLLERS ////////////////////////////////////

//GET ALL CLEARANCES BY STUDENT ID
exports.getClearancesByStudentId = (req, res, next) => {
    const student_id = req.id;
    Clearance.findAll({
        where: {
            student_id: student_id
        }
    }).then( clearances => {
        res.status(200).json({
            success: 1,
            clearance: clearances});
    }).catch(err => console.log(err));
}

//CREATE CLEARANCE
exports.createClearance = (req, res, next) => {
    
    //const type = req.body.type;
    const status = 'pending';
    const student_id = req.id;

    Clearance.findAll({
        where: {
            studentId: student_id
        }
    }).then(clearance => {
        if(clearance.length > 0){
            console.log('The resource you are trying to create already exists.')
            return res.status(409).json({message: 'The request you are trying to create already exists.'})
        }

        Clearance.bulkCreate([
            {type: 'library', status: status, student_id: student_id, studentId: student_id},
            {type: 'accounts', status: status, student_id: student_id, studentId: student_id},
            {type: 'admissions', status: status, student_id: student_id, studentId: student_id},
            {type: 'research', status: status, student_id: student_id, studentId: student_id}
        ]).then(result => {
            console.log(`Success`);
            res.status(201).json({
                success: 1,
                message: `Requested for clearance successfully`,
                clearance: result
            });
        }).catch(err => {
            console.log(err);
        });

    })
}

//UPDATE REQUEST
exports.updateClearance = (req, res, next) => {
    
    const clearance_id = req.params.id
    const type = req.body.type;
    const status = 'pending';
    const requested_date = curdate();
    const student_id = req.id;
    
    Clearance.findByPk(clearance_id).then(clearance => {
        if (!clearance) {
            return res.status(404).json({ message: 'Request not found'});
        }

        if (clearance.status == 'approved' || clearance.status == 'rejected'){
            return res.status(404).json({ message: 'Cant update your request now'});
        }
        
        clearance.type = type;
        clearance.status = status;
        clearance.requested_date = requested_date

        return clearance.save();

    }).then(result => {
        res.status(200).json({success: 1, message: `Request updated`, clearance: result});
    }).catch(err => console.log(err));
}
/////////////////////////// STAFF CONTROLLERS ///////////////////////////////////

//GET ALL CLEARANCES BY TYPE (accounts, admissions, research, library)
exports.getClearancesByType = (req, res, next) => {
    const type = req.role

    if (!type) {
        return res.status(400).json({ error: "Type parameter is missing." });
    }

    let sql = `SELECT clearance_requests.id, clearance_requests.type, clearance_requests.status, clearance_requests.createdAt, clearance_requests.staff_comment, students.fullname, students.student_number, students.program, students.email FROM clearance_requests INNER JOIN students ON clearance_requests.student_id = students.id WHERE clearance_requests.type = "${type}"`

    sequelize.query(sql, {type: QueryTypes.SELECT}).then( clearances => {
        res.status(200).json({
            success: 1,
            clearance: clearances});
    }).catch(err => console.log(err));
}

//GET ALL CLEARANCES BY TYPE & STATUS (accounts, admissions, research, library)
exports.getClearancesByTypeAndStatus = (req, res, next) => {
    const type = req.role;
    const status = req.params.status;

    let sql = `SELECT clearance_requests.id, clearance_requests.type, clearance_requests.status, clearance_requests.createdAt, clearance_requests.staff_comment, students.fullname, students.student_number, students.program FROM clearance_requests INNER JOIN students ON clearance_requests.student_id = students.id WHERE clearance_requests.type = "${type}" AND clearance_requests.status = "${status}"`

    sequelize.query(sql, {type: QueryTypes.SELECT}).then( clearances => {
        res.status(200).json({
            success: 1,
            clearance: clearances});
    }).catch(err => console.log(err));
}

//GET ALL CLEARANCES DETAILS BY STUDENT NUMBER
exports.getAllClearanceDetails = (req, res, next) => {
    const id = req.id;
    //const status = req.params.status;

    let sql = `SELECT clearance_requests.id, clearance_requests.type, clearance_requests.status, students.student_number, students.fullname as student_fullname, students.email as student_email, students.program, clearance_trackings.id as tracking_id, clearance_trackings.createdAt, staffs.fullname as staff_fullname FROM clearance_requests LEFT OUTER JOIN students on clearance_requests.student_id = students.id LEFT OUTER JOIN clearance_trackings ON clearance_requests.id = clearance_trackings.clearance_id LEFT OUTER JOIN staffs ON clearance_trackings.staff_id = staffs.id WHERE students.id = ${id}`

    sequelize.query(sql, {type: QueryTypes.SELECT}).then( clearances => {
        res.status(200).json({
            success: 1,
            clearance: clearances});
    }).catch(err => console.log(err));
}

//APPROVE/ REJECT REQUESTS
exports.clearanceAction = (req, res, next) => {
    
    const status = req.body.status;
    const email = req.body.email;
    const clearance_id = req.params.id;
    const staff_id = req.id;
    const role = req.role;
    
    Clearance.findByPk(clearance_id).then(clearance => {
        if (!clearance) {
            return res.status(404).json({ message: 'Request not found'});
        }
        
        clearance.status = status;

        Clearance_tracking.create({
            action_perfomed: status,
            clearance_id: clearance_id,
            clearanceRequestId: clearance_id,
            staff_id: staff_id,
            staffId: staff_id
        }).then(result => {
            //console.log(email)

            //capitalise first letter of role string
            const modRole = role[0].toUpperCase() + role.slice(1);
            
            //SEND EMAIL HERE
            const transporter = nodemailer.createTransport({
                service: "hotmail",
                //host: "smtp.gmail.com",
                //port: 587,
                //secure: false,
                auth: {
                  user: process.env.USER,
                  pass: process.env.APP_PASSWORD,
                },
              });

              const options = {
                from: {
                    name: 'admin',
                    address: process.env.USER
                },
                to: email,
                subject: `${modRole} clearance request`,
                text: `Your ${role} clearance request has been ${status}.`
              };
              
              const sendMail = async (transporter, mailOptions) => {
                try {
                    await transporter.sendMail(mailOptions);
                    console.log('Email sent');
                } catch (err) {
                    console.log(err);
                }
              }

              sendMail(transporter, options);

        }).catch(err => {
            console.log(err);
        });

        return clearance.save();

    }).then(result => {
        res.status(200).json({success: 1, message: `Request ${status}`, clearance: result});
    }).catch(err => console.log(err));
}

/**
 * SELECT clearance_requests.id, clearance_requests.type, clearance_requests.status, students.student_number, students.fullname as student_fullname, students.email as student_email, students.program, clearance_trackings.id as tracking_id, clearance_trackings.createdAt, staffs.fullname as staff_fullname FROM clearance_requests LEFT OUTER JOIN students on clearance_requests.student_id = students.id LEFT OUTER JOIN clearance_trackings ON clearance_requests.id = clearance_trackings.clearance_id LEFT OUTER JOIN staffs ON clearance_trackings.staff_id = staffs.id WHERE students.id =1
 */