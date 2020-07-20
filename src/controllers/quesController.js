const Ques = require("../models/question.js");
const Theloai = require("../models/categories.js");
const { query } = require("express");
const { AppError, catchAsync } = require("../utils/appError");

exports.getCategories = catchAsync(async (req, res, next) => {
  const Categories = await Theloai.find();

  res.json({ status: "ok", data: Categories });
});

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
  const newArr = await Theloai.convertToObject(Categories);
  const newQues = await Ques.create({
    title,
    description,
    source,
    sponsors,
    difficulties,
    logo,
    author,
    Categories: newArr,
  });

  res.send(newQues);
});

exports.getQues = catchAsync(async (req, res, next) => {
  const minDiff = req.query.minDiff;
  const maxDiff = req.query.maxDiff;
  const page = req.query.page * 1 || 1;
  const limit = 30;
  const skip = (page - 1) * limit;
  const ques = await Ques.find({
    difficulties: { $gte: minDiff, $lte: maxDiff },
  })
    .populate("Categories")
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

exports.deleteQues = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  if (!id) {
    next(new AppError(400, "id is required"));
  }
  const doc = await Ques.findOneAndDelete({ _id: id });
  console.log(doc);
  if (!doc) {
    return next(new AppError(404, "No document found"));
  }

  res.status(204).json({ status: "ok", message: "Question Deleted" });
});

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
