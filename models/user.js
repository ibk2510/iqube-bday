const mongoose = require('mongoose');


var UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dob: { type: String, required:true },
    email:   { type: String },
});

module.exports = mongoose.model('User', UserSchema);


