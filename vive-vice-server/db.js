const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    user_id:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: false
    },
    telefon:{
        type: String,
        require: false
    },
})
const model = new mongoose.model('User', UserSchema);
module.exports = model;