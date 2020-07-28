const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const round = 10;
const jwt = require("jsonwebtoken");

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    github:{
      type:String
    }
    ,
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    password: {
      type: String,
    },
    pictureURL:{
      type: String,
      trim: true,
    },
    tokens: [String],
    type: {
      type: String,
      enum: ["normal", "host"],
      required: [true, "Type is required"],
      default: "normal",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

schema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.tokens;
  delete obj.id;
  return obj;
};

schema.methods.generateToken = async function () {
  const token = jwt.sign(
    {
      _id: this._id,
    },
    process.env.SECRET,
    { expiresIn: "7d" }
  );
  this.tokens.push(token);
  await this.save();
  return token;
};

schema.statics.loginWithEmail = async function (email, password) {
  const user = await this.findOne({ email: email });
  if (!user) {
    return null;
  }

  const match = await bcrypt.compare(password, user.password);
  if (match) {
    return user;
  }

  return null;
};

schema.pre("save", async function (next) {
  console.log(this);
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, round);
  }
  next();
});

schema.statics.findOneOrCreate = async function ({ email, name }) {
  let user = await this.findOne({ email });
  if (!user) {
    user = await this.create({
      email: email,
      name: name,
    });
  }
  return user;
};

module.exports = mongoose.model("User", schema);
