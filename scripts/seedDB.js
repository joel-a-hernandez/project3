const mongoose = require("mongoose");
const db = require("../models");

// This file empties the Books collection and inserts the books below

mongoose.connect(
  process.env.MONGODB_URI ||
  "mongodb://localhost/trivia_masters"
);

const gameSeed = [
  {
    title: "Animal Trivia",
    category: "animals",
    questions: [
      {
        "q_id" : 0,
        "question": "What color is a lion?",
        "answers" : [
          "red",
          "black",
          "green",
          "yellow"
        ],
        "correctAnswer" : "yellow"
      },
      {
        "q_id" : 1,
        "question": "What color is a tiger?",
        "answers" : [
          "orange",
          "black",
          "green",
          "blue"
        ],
        "correctAnswer" : "orange"
      },
      {
        "q_id" : 2,
        "question": "What color is an elephant?",
        "answers" : [
          "orange",
          "grey",
          "green",
          "blue"
        ],
        "correctAnswer" : "grey"
      }
    ]
  },
  {
    title: "Disney Trivia",
    category: "pop-culture",
    questions: [
      {
        "q_id" : 0,
        "question": "What is Sleeping Beauty's name?",
        "answers" : [
          "Johanna",
          "Aurora",
          "Elizabeth",
          "Anna"
        ],
        "correctAnswer" : "Aurora"
      },
      {
        "q_id" : 1,
        "question": "What country is the movie Frozen modeled after?",
        "answers" : [
          "Germany",
          "Switzerland",
          "Norway",
          "Iceland"
        ],
        "correctAnswer" : "Norway"
      },
      {
        "q_id" : 2,
        "question": "How many mice friends does Cinderella have?",
        "answers" : [
          "2",
          "3",
          "4",
          "5"
        ],
        "correctAnswer" : "2"
      }
    ]
  }
];

db.Game
  .remove({})
  .then(() => db.Game.collection.insertMany(gameSeed))
  .then(data => {
    console.log(data.result.n + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
