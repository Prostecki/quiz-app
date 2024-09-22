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

console.log(questions);

const appContainer = document.getElementById("app-container");
const startButton = document.querySelector("button");
const welcomeSection = document.querySelector(".welcome-section");

startButton.addEventListener("click", startQuiz);

function clearPage() {
  document.body.innerHTML = "";
}

function startQuiz() {
  welcomeSection.remove();
  let quizWindow = document.createElement("div");
  quizWindow.style.width = "500px";
  quizWindow.style.backgroundColor = "grey";
  quizWindow.style.padding = "20px";
  quizWindow.style.color = "white";
  quizWindow.style.borderRadius = "10px";
  quizWindow.style.margin = "0 0 0 25px";

  for (let i = 0; i < questions.length; i++) {
    let quizQuestion = document.createElement("h3");
    quizQuestion.innerHTML = questions[i].question;
    console.log(quizQuestion);
    quizWindow.appendChild(quizQuestion);
    for (let y = 0; y < questions[i].options.length; y++) {
      let quizChoice = document.createElement("div");
      quizChoice.innerHTML = questions[i].options[y];
      quizChoice.style.cursor = "pointer";
      quizChoice.style.padding = "10px";
      quizChoice.style.border = "1px solid white";
      quizChoice.style.marginBottom = "5px";
      quizChoice.addEventListener("click", () => {
        alert(`You chose: ${questions[i].options[y]}`);
        if (questions[i].options[y] === questions[i].correctAnswer) {
          alert(`Congratulations! You were right`);
        } else {
          alert(`Not correct :( `);
        }
      });
      quizWindow.appendChild(quizChoice);
    }
  }
  appContainer.appendChild(quizWindow);
}
