const mongoose = require('mongoose')

const songShema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    artist:{
        type: String,
        required: true
    },
    album:{
        type: String,
        required: true
    },
    year:{
        type: Number,
        required: true
    },
    duration:{
        type: String,
        required: true
    },
    src:{
        type: String,
        required: true
    }
},
    {timestamps : true}
)

module.exports = mongoose.model('songs',songShema);
