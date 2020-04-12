const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const hel = require("../helper/helper");

// Load User model
const User = require("../models/User");

// Login Page
router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));

// Register Page
router.get("/register", forwardAuthenticated, (req, res) =>
  res.render("register")
);

router.get("/profile", ensureAuthenticated, (req, res) => {
  const user = req.user;
  let answerArray = user.answer;
  let totalNumberOfAnswers = answerArray.length;
  let correctAnswers = 0;
  let wrongAnswers = 0;
  let i = 0;
  for (i; i < totalNumberOfAnswers; i++) {
    if (answerArray[i]) {
      correctAnswers++;
    } else {
      wrongAnswers++;
    }
  }
  hel.averageOfAllUsers().then((e) => console.log(e));
  hel.bottomTenScores().then((e) => console.log(e));
  res.render("profile", { totalNumberOfAnswers, correctAnswers, wrongAnswers });
});

router.get("/leadership", ensureAuthenticated, (req, res) => {
  res.render("profile", { totalNumberOfAnswers, correctAnswers, wrongAnswers });
});

// Register
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/users/profile",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
