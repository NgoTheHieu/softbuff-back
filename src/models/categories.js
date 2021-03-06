const mongoose = require('mongoose');


const schema = new mongoose.Schema({
    category: {
        type: String,
        required: [true, "category is required"],
        unique: true,
        lowercase: true,
        trim: true
    },

})


schema.statics.convertToObject = async function (arr) {
    // Change arr to arr of objectid
    // find the tag from each string from Tag model
    // this = Tag
    let foo = arr.map(async e => {
        let bar = await this.findOne({ category : e.toLowerCase().trim() })
        if (bar)
            return bar
        bar = await this.create({ category: e.toLowerCase().trim() })
        return bar
    })
    let result = await Promise.all(foo)
    return result
}

module.exports = mongoose.model("Theloai", schema)