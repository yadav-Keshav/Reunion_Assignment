const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL;
function connectDB() {
    mongoose.connect(DB_URL).then((db) => { console.log(`sucefully Connected: ${db.connection.host}`) });
}
module.exports = connectDB;