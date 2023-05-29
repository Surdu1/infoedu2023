const mongoose = require('mongoose');
const like = new mongoose.Schema({
    video_id:{
        type: String,
        required: true
    },
    user_id:{
        type: String,
        required: true
    }
})
const like_add = new mongoose.model('like', like);
module.exports = like_add;