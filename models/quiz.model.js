const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  qid: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    required: true,
    auto: true,
  },
  categorylist: [String],
  question: {
    type: String,
  },
  answer: [
    {
      answer_text: { type: String },
      isCorrect: { type: Boolean },
    },
  ],
  votes: {
    type: Number,
    default: 0,
  },
});

const quizModel = mongoose.model("quizModel", QuizSchema);

module.exports = quizModel;
