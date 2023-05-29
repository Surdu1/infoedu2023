const mongoose = require('mongoose');
const videoSchema = new mongoose.Schema({
    filename:{
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true
    },
    user_id:{
        type: String,
        require: true
    },
    id:{
        type: String,
        require: true
    },
    time:{
        type: Number,
        require: true
    },
  });

const video_db = new mongoose.model('videos', videoSchema);
module.exports = video_db;