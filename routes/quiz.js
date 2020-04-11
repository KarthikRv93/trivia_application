const express = require('express');
const router = express.Router();
const quiz = require('../models/quiz.model');
const categoryModel  = require('../models/category.model');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/create-question', ensureAuthenticated, (req, res) =>{
  let result = []
  let k =0
  categoryModel.find({}, function(err, data){
      if (err){
        console.log(err);
      }if(data){
        for(k; k < data.length; k++){
          result.push(data[k].category);
        }
        res.render('create', {
          user: req.user, categories : result
        })
      }
  });
  

  
});

router.get('/select-category', ensureAuthenticated, (req, res) =>{
  let result = []
  let k =0
  categoryModel.find({}, function(err, data){
      if (err){
        console.log(err);
      }if(data){
        for(k; k < data.length; k++){
          result.push(data[k].category);
        }
        res.render('select', {
          user: req.user, categories : result
        })
    } 
});});

router.post('/select-question', (req, res, next) => {
  const { categories} = req.body;
  quiz.find({categorylist:{$in:categories}}, function(err, data){
    if (err){
      console.log("error in query");
    }else if(data){
      
      let questionObj = data[ Math.floor(Math.random() * data.length) ];
      console.log('here', categories);
      res.render('answer', {question: questionObj.question, answer:questionObj.answer, categories: categories})
    }
  });
});

  router.post('/verify', (req, res, next) => {
    const { correct} = req.body;
    const user = req.user;
    let points = 10;//user.points;
    console.log(user)
    if(correct){
        points += 4
    }else{
        points -= 1
    }


});


router.get('/answer', ensureAuthenticated, (req, res) =>{
  const questionid = req.query.questionid
  const categories = req.query.categories
  quiz.findOne({id:questionid}, function(err, data){
    if (err){
      console.log("error in query");
    }else if(data){
      let question = data.question;
      let answer = data.answer;
      res.render( "answer", {
        user: req.user, question : question, answer: answer
      });
    }
  });
});

router.post('/create', (req, res, next) => {
  const { categoryType, category, question, answer } = req.body;
  const categorylist = category;
  let newquiz = new quiz({
    categorylist, question, answer
   });
  let i =0;
  for (i; i < category.length; i++){
    let newcategory = category[i];
    categoryModel.findOne({category: newcategory}, function(err, result){
      if (err){
        console.log(err);
      }
      if(result){
          console.log("category already present")
      }else{
        categoryModel.create({category: newcategory});
      }
    });
    
      
  }
  newquiz.save()
  res.redirect('/quiz/create-question');

});

module.exports = router;