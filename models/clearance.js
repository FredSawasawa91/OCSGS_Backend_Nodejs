const Sequelize = require('sequelize');
const Student = require('./student');
const db = require('../utils/db');

const Clearance = db.define( 'clearance_request', {
    type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    /*request_date: {
        type: Sequelize.STRING,
        allowNull: false
    },*/
    completion_date: {
        type: Sequelize.STRING,
        allowNull: true
    },
    staff_comment: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

Student.hasMany(Clearance, {
    foreignKey: 'student_id'
});
Clearance.belongsTo(Student);

module.exports = Clearance;