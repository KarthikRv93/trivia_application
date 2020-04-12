const quiz = require("../models/quiz.model");
const userModel = require("../models/User");
const categoryModel = require("../models/category.model");
const mongoose = require("mongoose");
const db = require("../config/keys").mongoURI;

Array.prototype.average = function () {
  let sum = this.reduce((acc, curr) => (acc += parseInt(curr)), 0);
  return sum / this.length;
};

const averageOfAllUsers = () =>
  userModel
    .find({})
    .exec()
    .then((e) => e.map((e) => e.points).average());

const topTenScores = () =>
  userModel.find({}).sort({ points: -1 }).limit(10).exec();

const bottomTenScores = () =>
  userModel.find({}).sort({ points: 1 }).limit(10).exec();

module.exports = {
  streakOfRightAnswers: function () {},
  streakOfRightAnswers: function () {},
  averageOfAllUsers: averageOfAllUsers,
  topTenScores: topTenScores,

  bottomTenScores: bottomTenScores,
};

// mongoose
//   .connect(db, { useNewUrlParser: true })
//   .then(() => {
//     console.log("MongoDB Connected");
//     averageOfAllUsers().then((e) =>
//       e.map((e) => e.points).reduce((acc, curr) => (acc += parseInt(curr)), 0)
//     );
//     //   .then(function (e) {
//     //     return e.map(function (element) {
//     //       let actualPoints = parseInt(element.points) * 1000;
//     //       return actualPoints;
//     //     });
//     //   })
//   })
//   .catch((err) => console.log(err));
