const express = require('express');
const router = express.Router();
const quiz = require('../models/quiz.model');

const userModel = require('../models/User');
const categoryModel = require('../models/category.model');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/create-question', ensureAuthenticated, (req, res) => {
  let result = [];
  let k = 0;
  categoryModel.find({}, function (err, data) {
    if (err) {
      console.log(err);
    }
    if (data) {
      for (k; k < data.length; k++) {
        result.push(data[k].category);
      }
      console.log(data);
      res.render('create', {
        user: req.user,
        categories: result,
      });
    }
  });
});

router.get('/select-category', ensureAuthenticated, (req, res) => {
  let result = [];
  let k = 0;
  categoryModel.find({}, function (err, data) {
    if (err) {
      console.log(err);
    }
    if (data) {
      for (k; k < data.length; k++) {
        result.push(data[k].category);
      }
      res.render('select', {
        user: req.user,
        categories: result,
      });
    }
  });
});

router.post('/select-question', (req, res, next) => {
  const { categories } = req.body;
  quiz.find({ categorylist: { $in: categories } }, function (err, data) {
    if (err) {
      console.log('error in query');
    } else if (data) {
      let questionObj = data[Math.floor(Math.random() * data.length)];

      res.render('answer', {
        questionid: questionObj.qid,
        question: questionObj.question,
        answer: questionObj.answer,
        votes: questionObj.votes,
        categories: categories,
      });
    }
  });
});

router.post('/verify', (req, res, next) => {
  const { selected, question } = req.body;
  //console.log(req);

  //console.log(question);
  user = req.user;
  points = user.points;
  correct = false;
  let list = [];
  quiz.findOne({ qid: question }, function (err, data) {
    if (err) {
      console.log('error in query');
    }
    //console.log(data);
    if (data) {
      let answer = data.answer;

      console.log(answer);
      //console.log(data);
      final = [];
      let o = 0;
      for (o; o < answer.length; o++) {
        if (answer[o].isCorrect) {
          final.push(answer[o].answer_text);
        }
      }
      let flag =
        final.length === selected.length &&
        final.sort().every(function (value, index) {
          return value === selected.sort()[index];
        });
      if (flag) {
        correct = true;
        points += 4;
        console.log(points);
      } else {
        points -= 1;
        correct = false;
      }
      answerArray = user.answer;
      answerArray.push(correct);
      userModel.findOneAndUpdate(
        { email: user.email },
        { points: points, answer: answerArray },
        { upsert: true },
        function (err, doc) {
          if (err) return res.send(500, { error: err });
        }
      );
    }
    quizResult = '';
    if (correct) {
      quizResult = 'Correct Answer';
    } else {
      quizResult = 'Wrong Answer';
    }
    res.send({ quizResult, final, selected });
  });
});

router.get('/answer', ensureAuthenticated, (req, res) => {
  const questionid = req.query.questionid;
  const categories = req.query.categories;
  quiz.findOne({ qid: questionid }, function (err, data) {
    if (err) {
      console.log('error in query');
    } else if (data) {
      let question = data.question;
      let answer = data.answer;
      res.render('answer', {
        user: req.user,
        question: question,
        answer: answer,
      });
    }
  });
});

router.post('/create', (req, res, next) => {
  const { categoryType, category, question, answer } = req.body;
  const categorylist = category;
  let newquiz = new quiz({
    categorylist,
    question,
    answer,
  });
  let i = 0;
  for (i; i < category.length; i++) {
    let newcategory = category[i];
    categoryModel.findOne({ category: newcategory }, function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        console.log('category already present');
      } else {
        categoryModel.create({ category: newcategory });
      }
    });
  }
  newquiz.save();
  res.redirect('/quiz/create-question');
});

// Upvote - downvote feature

router.post('/upvote', (req, res) => {
  const questionId = req.body.questionid;
  let votes = 0;
  quiz.findOne({ qid: questionId })
    .then((data) => {
      if (data) {
        data.votes += 1;
        data.save().then(() => {
            console.log('Upvoted successfully!', questionId);
            res.send({
              success: true,
              votes: data.votes,
            });
          })
          .catch((err) => console.log('error upvoting question'));
      } else {
        res.send({
          success: false,
          err: "Invalid Id",
        });
      }
    })
    .catch((err) => {
      console.log(`Unable to query query question: ${questionId}`, err);
      res.send({
        success: false,
        err,
      });
    });
});

router.post('/downvote', (req, res) => {
  const questionId = req.body.questionid;
  let votes = 0;
  quiz.findOne({ qid: questionId })
    .then((data) => {
      if (data) {
        data.votes -= 1;
        data.save().then(() => {
            console.log('Downvoted successfully!', questionId);
            res.send({
              success: true,
              votes: data.votes,
            });
          })
          .catch((err) => console.log('error upvoting question'));
      } else {
        res.send({
          success: false,
          err: "Invalid Id",
        });
      }
    })
    .catch((err) => {
      console.log(`Unable to query query question: ${questionId}`, err);
      res.send({
        success: false,
        err,
      });
    });
});

module.exports = router;
