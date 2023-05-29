const mongoose = require('mongoose');
const addVizionare = new mongoose.Schema({
    video_id: {
        type: String,
        required: true
    },
    user_id:{
        type: String,
        required: false
    }
})
const Vizionare_add = new mongoose.model('vizionari', addVizionare);
module.exports = Vizionare_add;