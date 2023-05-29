const mongoose = require('mongoose');
const comentariu = new mongoose.Schema({
    video_id:{
        type: String,
        required: true
    },
    user_id:{
        type: String,
        required: true
    },
    comentariu: {
        type: String,
        required: true
    }
})
const cometariu_add = new mongoose.model('comentariu', comentariu);
module.exports = cometariu_add;