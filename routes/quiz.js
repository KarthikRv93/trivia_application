const express = require('express');
const router = express.Router();
const quiz = require('../models/quiz.model');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


router.get('/profile', ensureAuthenticated, (req, res) =>
  res.render('profile', {
    user: req.user
  })
);

router.get('/create-question', ensureAuthenticated, (req, res) =>
  res.render('create', {
    user: req.user
  })
);

router.get('/answer-question', ensureAuthenticated, (req, res) =>
  res.render('create', {
    user: req.user
  })
);

router.post('/create', (req, res, next) => {
  const { category, question, answer } = req.body;
  const categorylist = []
  console.log({ category, question, answer })
  categorylist.push(category)

  let newquiz = new quiz({
    categorylist, question, answer
   });
  newquiz.save()
  res.redirect('/quiz/create-question');

});

module.exports = router;