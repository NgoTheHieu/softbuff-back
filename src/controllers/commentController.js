const { AppError, catchAsync } = require("../utils/appError")
// const { deleteOne } = require("./handlerFactory")
const Comment = require("../models/comment");
const { schema } = require("../models/comment");



exports.getComment = catchAsync(async (req, res, next) => {
    const comments = await Comment.find({
        question: req.params.id
    }).populate("question").populate("user")
    res.json({ status: "ok", data: comments })
})


exports.updateComment = catchAsync(async (req, res, next) => {
    const review = await Comment.findOneAndUpdate(
        {
            experience: req.params.eid,
            user: req.user._id,
            _id: req.params.rid,
        },
        {   
            ...req.body, 
            user: req.user._id,
            experience: req.params.eid,
        },
        {
            new: true,
            runValidators: true
        })
    res.json({ status: "ok", data: review })
})

exports.createComment = catchAsync(async (req, res, next) => {
    const comment = await Comment.create({
        body: req.body.comment,
        question: req.params.id,
        user: req.user._id
    })
    res.status(201).json({ status: "ok", data: comment })
})



// exports.deleteComment = deleteOne(Comment)

