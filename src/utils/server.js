const User = require("../models/user")
const Room = require("../models/room")
const Chat = require("../models/chat")

class Server{
    constructor(user){
        this.user = user
    }

    static login = async (username,socketID)=>{
        let user = await User.findOne({name:userName})
        if(!user){user = new User({name:userName,token:socketID,room:null})}

        user.token = socketID
        await user.save()

        return user
    }

    static checkUser = async (socketID)=>{
        let user = await User.findOne({token:socketID})
        if(!user) throw new Error("User not found. Please login!")
        return new Server(user)
    }

    checkMember = async (rID) => {
        let room = await Room.findById(rID)
        if(!room.members.includes(this.user._id)) throw new Error("Not a member of this room")
    }

    joinRoom = async (rID)=>{
        const room = await Room.findById(rID)
        if(!room) throw new Error("Room not found")
        if(!room.members.includes(this.user._id)){
            room.members.push(this.user._id)
            await room.save()
        }
        this.user.room = rID
        await this.user.save()
        this.user.room = room
    }

    createChat = async (chatObj)=>{
        const chat = new Chat({
            user:{
                id:this.user._id,
                name:chatObj.name
            },
            room:this.user.room_id,
            text:chatObj.text
        })

        await chat.save()

        return chat
    }

    createWelcomeMessage = async()=>{
        const message = new Chat({
            user:{
                name: ""
            },
            text: `Welcome ${this.user.name} to ${this.user.room.name}`,
            room:this.user.room._id
        })
        await message.save()
        return message
    }

    newUserJoinMessage = async()=>{
        const message = new Chat({
            user:{
                name:" "
            },
            text:`${this.user.name} has left ${this.user.room.name}`,
            room:this.user.room._id
        })

        await message.save()
        return message
    }
}