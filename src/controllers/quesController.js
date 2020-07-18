const Ques = require("../models/question.js");
const { query } = require("express");
const { AppError, catchAsync } = require("../utils/appError");
exports.createQues = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    source,
    sponsors,
    Categories,
    difficulties,
    logo,
    author,
  } = req.body;
  if (!title || !description || !source) {
    next(new AppError(400, "Title, description and tags are required"));
  }

  const newQues = await Ques.create({
    title,
    description,
    source,
    sponsors,
    difficulties,
    logo,
    author,
    Categories,
  });

  res.send(newQues);
});

exports.getQues = catchAsync(async (req, res, next) => {
  const minDiff = req.query.minDiff;
  const maxDiff = req.query.maxDiff;
  const page = req.query.page * 1 || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const ques = await Ques.find({
    difficulties: { $gte: minDiff, $lte: maxDiff },
  })
    .limit(limit)
    .skip(skip)
    .sort({ diff: 1 });
  res.json({ status: "ok", data: { ques } });
  res.send({ status: "ok", data: { ques } });
});
exports.getQuesByID = async (req, res) => {
  console.log(req.params);
  const getQues = await Ques.findById({
    _id: req.params.id,
  });
  res.send(getQues);
};

exports.updateQuesByID = async (req, res) => {
  const updateQues = await Ques.findOne({
    _id: req.params.id,
  });
  for (const key in req.body) {
    updateExp[key] = req.body[key];
  }
  await updateQues.save();
  res.json({ status: "ok", data: updateExp });
};

// exports.updateQues = async (req, res, next) => {};
// const mongoose = require("mongoose");

// const schema = new mongoose.Schema({
//   title: String,
//   pictureURL: String,
//   description: String,
//   difficulties: String,
//   rating: String,
//   source: String,

// });

// const Question = mongoose.model("Question", schema);

// module.exports = Question;
