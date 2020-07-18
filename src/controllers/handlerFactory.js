// const Tag = require("../models/tag")
// const {AppError, catchAsync}= require("../utils/appError")

// exports.deleteOne = Model => catchAsync(async(req,res,next)=>{
//     let filterObj = {}
//     if(Model.modelName === "Ques"){
//         filterObj._id = req.params.eid
//         filterObj.host = req.user._id
//     } else if (Model.modelName === "Review"){
//         filterObj._id = req.params.rid
//         filterObj.user = req.user._id
//     }
//     const doc = await Model.findOneAndDelete(filteObj)
//     if(!doc){
//         return next(new AppError(404,"No document found"))
//     }

//     res.status(204).end()

// })

// exports.updateOne = Model => async (req, res, next) => {
//     try {

//         let filterObj = {}
//         let allows = []

//         if (Model.modelName === "Ques") {
//             filterObj._id = req.params.eid;
//             filterObj.host = req.user._id
//             allows = ['title', "description", 'tags']
//             if (req.body.tags) {
//                 req.body.tags = await Tag.convertToObject(req.body.tags)
//             }

//         } else if (Model.modelName === "Review") {
//             filterObj._id = req.params.rid;
//             filterObj.user = req.user._id
//             allows = ['rating', "review"]
//         } else if (Model.modelName === "User") {

//         }
//         const doc = await Model.findOne(filterObj)
//         if (!doc) return res.status(404).json({ status: "fail", message: "No document found" })

//         // Modify data,
//         //  change the value of properties in doc accroding the allows array
//         for (const key in req.body) {
//             if (allows.includes(key)) {
//                 doc[key] = req.body[key]
//             }
//         };
//         await doc.save()
//         /////////////

//         res.status(200).json({ status: 'ok', data: doc });
//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({ status: "error", message: err.message })
//     }
// }