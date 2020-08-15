const User = require("../models/user");
const { promisify } = require("util");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const passport = require("passport");
const _ = require("lodash");
const validator = require("validator");
const mailChecker = require("mailchecker");
// const User = require("../models/User");
const randomBytesAsync = promisify(crypto.randomBytes);
exports.createUser = async (req, res, next) => {
  try {
    const { email, name, password, type } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({
        status: "Fail",
        error: "Email, name and password are required",
      });
    }

    const user = await User.create({
      email: email,
      name: name,
      password: password,
      type: type || "normal",
    });

    res.status(201).json({ status: "ok", data: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", error: err.message });
  }
};

exports.getMyProfile = async (req, res) => {
  res.json({ status: "ok", data: req.user });
};

exports.logout = (req, res, next) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) console.log("Error:failed to destroy the session during logout");
    req.user = null;
    res.redirect("/");
  });
};

exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("account/signup", {
    title: "Create Account",
  });
};

exports.postSignup = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Enter a valid email" });
  if (!validator.isEmpty(req.body.email))
    validationErrors.push({ msg: "Please enter your email" });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Password do not match" });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/signup");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      req.flash("errors", {
        msg: "Account with that email address already exists",
      });
      return res.redirect("/signup");
    }
    user.save((err) => {
      if (err) return next(err);
      req.logIn(user, (err) => {
        if (err) return next(err);
        res.redirect("/");
      });
    });
  });
};

exports.postUpdateProfile = async (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address" });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("account");
  }

  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });
  User.findById(req.user.id, (err, user) => {
    if (err) return next(err);
    if (user.email !== req.body.email) user.emailVerified = false;
    user.email = req.body.email || "";
    user.profile.name = req.body.name || "";
    user.profile.gender = req.body.gender || "";
    user.profile.location = req.body.location || "";
    user.profile.website = req.body.website || "";
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash("errors", {
            msg:
              "The email adrees you have entered is already associated with an account",
          });
          return res.redirect("/account");
        }
        return next(err);
      }
      req.flash("success", { msg: "Profile information has been updated" });
      req.resdirect("/account");
    });
  });
};

exports.postDeleteAccount = (req, res, next) => {
  User.deleteOne({ _id: req.user.id }, (err) => {
    if (err) {
      return next(err);
    }
    req.logout();
    req.flash("info", { msg: "Your account has been deleted" });
    res.redirect("/");
  });
};

exports.getOauthUnlink = (req, res, next) => {
  const { provider } = req.params;
  User.findById(req.user.id, (err, user) => {
    if (err) return next(err);
    user[provider.toLowerCase()] = undefined;
    const tokensWithoutProviderToUnlink = user.tokens.filter((token) => {
      token.kind !== provider.toLowerCase();
    });
    if (
      !(user.email && user.password) &&
      tokensWithoutProviderToUnlink.length === 0
    ) {
      req.flash("errors", {
        msg:
          `The ${_.startCase(
            _.toLower(provider)
          )} account cannot be unlinked without another form of login enabled.` +
          "Please link another account or add an email address and password",
      });
      return res.redirect("/account");
    }
    user.tokens = tokensWithoutProviderToUnlink;
    user.save((err) => {
      if (err) {
        return next(err);
      }
      req.flash("info", {
        msg: `${_.startCase(_.toLower(provider))}`,
      });
      res.redirect("/account");
    });
  });
};

exports.getReset = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  const validationErrors = [];
  if (!validator.isHexadecimal(req.params.token)) {
    validationErrors.push({ msg: "Invalid Token. Please retry." });
  }
  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/forgot");
  }

  User.findOne({ passwordResetToken: req.params.token })
    .where("passwordResetExpires")
    .gt(Date.now())
    .exec((err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash("errors", {
          msg: "Password reset token is invalid or has expired.",
        });
        return res.redirect("/forgot");
      }
      res.render("account/reset", {
        title: "Password Reset",
      });
    });
};

exports.postForgot = (req, res, next) => {
  const validationErrors = [];
  if(!validator.isEmail(req.body.email)){
    validationErrors.push({msg:"Please enter a valid email address"})
  }
  if(validationErrors.length){

  }
};
