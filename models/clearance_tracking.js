const Sequelize = require('sequelize');
const Clearance = require('./clearance');
const Staff = require('./staff');
const db = require('../utils/db');

const Clearance_tracking = db.define( 'clearance_tracking', {
    action_perfomed: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Clearance.hasOne(Clearance_tracking, {
    foreignKey: 'clearance_id'
});
Clearance_tracking.belongsTo(Clearance);

Staff.hasMany(Clearance_tracking, {
    foreignKey: 'staff_id'
});
Clearance_tracking.belongsTo(Staff);

module.exports = Clearance_tracking;