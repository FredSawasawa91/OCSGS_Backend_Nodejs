const express = require('express');
const sequelize = require('./utils/db');
const cors = require('cors')
const Student = require('./models/student');
const Staff = require('./models/staff');
const Clearance = require('./models/clearance')
const Clearance_tracking = require('./models/clearance_tracking');

const app = express();

app.use(express.json());

app.use(cors())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH');
    next()
});

//ROUTES
app.use('/student_login', require('./routes/student_login'));
app.use('/staff_login', require('./routes/staff_login'));

app.use('/student', require('./routes/student'));
app.use('/staff', require('./routes/staff'));
app.use('/clearance', require('./routes/clearance'));

//ERROR HANDLING
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({message:message});
});

//SYNC DATABASE
sequelize.sync()
    .then(result => {
        console.log('Database connected successfully');
        app.listen(process.env.PORT || 8080)
    })
    .catch(err => console.log(err));