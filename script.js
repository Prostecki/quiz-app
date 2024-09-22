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

// Function to clear the entire page content
function clearPage() {
  document.body.innerHTML = ""; // Set the body's inner HTML to an empty string
}

// Variable to keep track of the current question index
let currentQuestionIndex = 0;

// Function to start the quiz
function startQuiz() {
  welcomeSection.remove(); // Remove the welcome section from the DOM
  let quizWindow = document.createElement("div"); // Create a new div for the quiz window
  quizWindow.className = "quiz-window"; // Set the class name for styling

  // Function to show the current question
  function showQuestion() {
    quizWindow.innerHTML = ""; // Clear previous question and answers

    // Check if we still have questions left in the array
    if (currentQuestionIndex < questions.length) {
      let quizQuestion = document.createElement("h3"); // Create an h3 element for the question
      quizQuestion.className = "quiz-question"; // Set class for styling
      quizQuestion.innerHTML = questions[currentQuestionIndex].question; // Set the question text
      quizWindow.appendChild(quizQuestion); // Add the question to the quiz window

      // Loop through the options for the current question
      for (let y = 0; y < questions[currentQuestionIndex].options.length; y++) {
        let quizChoice = document.createElement("div"); // Create a div for each answer option
        quizChoice.innerHTML = questions[currentQuestionIndex].options[y]; // Set the option text
        quizChoice.className = "quiz-choice"; // Set class for styling

        // Add click event listener for each choice
        quizChoice.addEventListener("click", () => {
          let rightAnswer = document.createElement("div"); // Create a div to show feedback
          rightAnswer.className = "quiz-right"; // Set class for styling

          // Check if the chosen answer is correct
          if (
            questions[currentQuestionIndex].options[y] ===
            questions[currentQuestionIndex].correctAnswer
          ) {
            rightAnswer.innerHTML =
              "You are right!, " +
              questions[currentQuestionIndex].correctAnswer; // Set feedback for correct answer
            rightAnswer.style.color = "white"; // Set text color to white
          } else {
            rightAnswer.innerHTML =
              "You made a mistake! " +
              questions[currentQuestionIndex].correctAnswer; // Set feedback for incorrect answer
            rightAnswer.style.backgroundColor = "red"; // Set background color to red
            rightAnswer.style.color = "white"; // Set text color to white
          }

          quizWindow.appendChild(rightAnswer); // Add the feedback to the quiz window
          currentQuestionIndex++; // Move to the next question
          // Show the next question after a delay of 2 seconds
          setTimeout(showQuestion, 2000);
        });

        quizWindow.appendChild(quizChoice); // Add the answer option to the quiz window
      }
    } else {
      // If there are no more questions
      quizWindow.innerHTML = "<h3>Quiz Finished!</h3>"; // Display quiz finished message
    }
  }

  // Show the first question when the quiz starts
  showQuestion();
  // Add the quiz window to the app container in the DOM
  appContainer.appendChild(quizWindow);
}
