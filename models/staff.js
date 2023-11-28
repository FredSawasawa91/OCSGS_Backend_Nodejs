const Sequelize = require('sequelize');
const db = require('../utils/db');

const Staff = db.define( 'staff', {
    fullname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [['admin', 'library', 'accounts', 'research', 'admissions', 'cd']],
                msg: 'Role must be one of admin, librarian, accountant, research coordinator, admissions or campus director'
            }
        }
    }
});

module.exports = Staff;