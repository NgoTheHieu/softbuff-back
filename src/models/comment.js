const mongoose = require("mongoose");
const Question = require("./question")
const { AppError, catchAsync } = require("../utils/appError")


const schema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        trim: true
    },
    body: {
        type: String,
        trim: true,
        default: ""
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    question: {
        type: mongoose.Types.ObjectId,
        ref: "Question",
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});



// middleware for post (save)
schema.post("save", async function () {
    // `this`  ===== review doc (review instance)
    // this.constructor ===== Review model
    await this.constructor.calculateAverage(this.experience)
})


schema.pre(/^findOneAnd/, async function (next) {
    // `this`  ===== Review.query (query)
    this.doc = await this.findOne()
    if(!this.doc){
        return next(new AppError(404, "Doc not found"))
    }
    return next()
})

// query middleware to trigger upon findOneAnd....
schema.post(/^findOneAnd/, async function () {
    // `this`  ===== Review.query
    // this.doc === review doc
    // this.doc.constructor ===== Review model
    await this.doc.constructor.calculateAverage(this.doc.experience)
})


// calculate average
schema.statics.calculateAverage = async function (eid) {
    // `this` refers to Review model
    console.log(eid)
    const stats = await this.aggregate([
        {
            $match: { experience: eid }
        },
        {
            $group: {
                _id: "$experience",
                nRating: { $sum: 1 },
                avgRating: { $avg: "$rating" }
            }
        }
    ])
    await Question.findByIdAndUpdate(eid, {
        nRating: stats.length > 0 ? stats[0].nRating : 0,
        averageRating: stats.length > 0 ? stats[0].avgRating : 0
    })
}




module.exports = mongoose.model("Comment", schema)

// haha