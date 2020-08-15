const mongoose = require("mongoose")

const roomSchema = new mongoose.Schema({
    name:{
        type:String,
        required:false
    },
    members:[{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        unique:true
    }]
})

module.exports = mongoose.model("Room", roomSchema)