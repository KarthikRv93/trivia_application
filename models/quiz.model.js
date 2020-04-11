const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  categorylist: [String],
  question: {
    type: String
  },
  answer : [{
    answer_text : {type:String},
    isCorrect : {type: Boolean}
  }]
});

const quizModel = mongoose.model('quizModel', QuizSchema);

module.exports = quizModel;
