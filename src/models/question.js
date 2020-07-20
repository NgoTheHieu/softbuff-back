const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    minLength: 5,
    maxLength: 100,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    minLength: 5,
    maxLength: 1000,
    required: true,
  },
  source: {
    type: String,
    trim: true,
    required: true,
  },
  sponsors: [
    {
      type: String,
      trim: true,
      required: true,
    },
  ],
  Categories: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Theloai",
      required: true,
    }
  ],
  logo: {
    type: String,
    trim: true,
    required: true,
  },
  difficulties: {
    type: Number,
    trim: true,
    required: true,
  },
  author: {
    type: String,
    trim: true,
    required: false,
  },
  // averageRating: {
  //   type: Number,
  //   default: 0,
  //   min: 0,
  //   max: 5,
  // },
  // nRating: {
  //   type: Number,
  //   default: 0,
  // },
});

const Question = mongoose.model("Question", schema);

module.exports = Question;
