const express = require("express")
const router = express.Router()
const Room = require("../src/models/room")

router.route("/").get(async (req,res,next)=>{
    try{
        await Room.insertMany([
            {
                name:"Chrome",
                members:[]
            },
            {
                name:"Safari",
                members:[]
            },
            {
                members:"Firefox",
                members:[]
            },
            {
                name:"Opera",
                members:[]
            },
            {
                name:"Coccoc",
                members:[]
            }
        ])
        res.status(200).send({status:"ok",message:"rooms created"})
    } catch(err){
        return res.status(400).send(err.message)
    }
})

module.exports = router