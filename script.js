const questions = [
  {
    question: "Какой язык программирования используется для веб-разработки?",
    options: ["JavaScript", "Ruby", "C++", "Swift"],
    correctAnswer: "JavaScript",
  },
  {
    question: "Что означает аббревиатура CSS?",
    options: [
      "Cascading Style Sheets",
      "Creative Style System",
      "Computer Style Sheets",
      "Cascading Script Sheets",
    ],
    correctAnswer: "Cascading Style Sheets",
  },
  {
    question: "Какой HTML-тег используется для создания ссылок?",
    options: ["link", "a", "href", "url"],
    correctAnswer: "a",
  },
  {
    question:
      "Какой метод в JavaScript используется для получения элемента по ID?",
    options: [
      "getElementById()",
      "querySelector()",
      "getElementsByClassName()",
      "getElement()",
    ],
    correctAnswer: "getElementById()",
  },
  {
    question: "Что такое JSON?",
    options: [
      "JavaScript Object Notation",
      "JavaScript Online Notation",
      "Java Standard Object Notation",
      "Java Object Notation",
    ],
    correctAnswer: "JavaScript Object Notation",
  },
  {
    question: "Какой тег используется для вставки изображений в HTML?",
    options: ["image", "img", "picture", "src"],
    correctAnswer: "<img>",
  },
  {
    question: "Что такое Flexbox?",
    options: [
      "Метод программирования",
      "Система разметки",
      "Модель компоновки",
      "Язык стилей",
    ],
    correctAnswer: "Модель компоновки",
  },
  {
    question: "Какой символ используется для комментирования в JavaScript?",
    options: ["//", "#", "/*", "!-- >"],
    correctAnswer: "//",
  },
  {
    question:
      "Какой метод используется для добавления элемента в конец массива в JavaScript?",
    options: ["push()", "add()", "insert()", "append()"],
    correctAnswer: "push()",
  },
  {
    question: "Какой тег HTML используется для создания списков?",
    options: ["ul", "list", "ol", "li"],
    correctAnswer: "<ul>",
  },
];

//To display question in the browser console
console.log(questions);

//app container where i store all questions
const appContainer = document.getElementById("app-container");
const startButton = document.querySelector("button");
const welcomeSection = document.querySelector(".welcome-section");

startButton.addEventListener("click", startQuiz);
// document.body.addEventListener("load", appContainer.remove());

function clearPage() {
  document.body.innerHTML = "";
}

let currentQuestionIndex = 0; // Вынесите это за пределы функции

function startQuiz() {
  welcomeSection.remove();
  let quizWindow = document.createElement("div");
  quizWindow.className = "quiz-window";

  function showQuestion() {
    //Clear a previous question
    quizWindow.innerHTML = "";

    //Begin with 0, and check for array if we aren't out of it
    if (currentQuestionIndex < questions.length) {
      let quizQuestion = document.createElement("h3");
      quizQuestion.className = "quiz-question";
      //Add a content of current question
      quizQuestion.innerHTML = questions[currentQuestionIndex].question;
      //Add an element in DOM
      quizWindow.appendChild(quizQuestion);

      //Begin with 0, and check for array of options into questions
      for (let y = 0; y < questions[currentQuestionIndex].options.length; y++) {
        let quizChoice = document.createElement("div");
        quizChoice.innerHTML = questions[currentQuestionIndex].options[y];
        quizChoice.className = "quiz-choice";

        //When you click on answers, you have alternatives
        quizChoice.addEventListener("click", () => {
          //   alert(`You chose: ${questions[currentQuestionIndex].options[y]}`);
          if (
            questions[currentQuestionIndex].options[y] ===
            questions[currentQuestionIndex].correctAnswer
          ) {
            alert(`Congratulations! You were right`);
            quizChoice.style.backgroundColor = "green";
          } else {
            alert(`Not correct :( `);
          }
          currentQuestionIndex++;
          //Show a next question
          showQuestion();
        });

        quizWindow.appendChild(quizChoice);
      }
    } else {
      // If there aren't question, it shows
      quizWindow.innerHTML = "<h3>Quiz Finished!</h3>";
    }
  }

  //Show a next question
  showQuestion();
  //Add a window with question
  appContainer.appendChild(quizWindow);
}
