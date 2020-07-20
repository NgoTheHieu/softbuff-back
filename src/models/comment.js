const mongoose = require('mongoose');


const schema = new mongoose.Schema({
    user:{

    },
    question:{

    },
    content:{

    },

})


schema.statics.convertToObject = async function (arr) {

}

module.exports = mongoose.model("Category", schema)