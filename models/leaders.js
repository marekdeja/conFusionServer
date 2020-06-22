const mongoose = require('mongoose')
const Schema = mongoose.Schema

const leaderSchema = new Schema ({
    name:{
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String
    },
    designation:{
        type: String,
        default: ''
    },
    abbr:{
        type: String
    },
    description: {
        type: String
    },
    featured:{
        type: Boolean,
        default: false
    }
})

var Leaders = mongoose.model('Leader', leaderSchema)

module.exports = Leaders