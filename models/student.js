const Sequelize = require('sequelize');
const db = require('../utils/db');

const Student = db.define( 'student', {
    student_number: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fullname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    program: {
        type: Sequelize.STRING,
        allowNull: false
    },
    year_joined: {
        type: Sequelize.STRING,
        allowNull: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Student;