const questions = [
  {
    question:
      "Which programming language is the most popular for developing websites today?",
    options: ["JavaScript", "Ruby", "C++", "Swift"],
    correctAnswer: "JavaScript",
  },
  {
    question: "What does the abbreviation CSS stand for?",
    options: [
      "Cascading Style Sheets",
      "Creative Style System",
      "Computer Style Sheets",
      "Cascading Script Sheets",
    ],
    correctAnswer: "Cascading Style Sheets",
  },
  {
    question: "Which HTML tag is used to create links?",
    options: ["link", "a", "href", "url"],
    correctAnswer: "a",
  },
  {
    question: "Which JavaScript method is used to get an element by ID?",
    options: [
      "getElementById()",
      "querySelector()",
      "getElementsByClassName()",
      "getElement()",
    ],
    correctAnswer: "getElementById()",
  },
  {
    question: "What is JSON?",
    options: [
      "JavaScript Object Notation",
      "JavaScript Online Notation",
      "Java Standard Object Notation",
      "Java Object Notation",
    ],
    correctAnswer: "JavaScript Object Notation",
  },
  {
    question: "Which tag is used to insert images in HTML?",
    options: ["image", "img", "picture", "src"],
    correctAnswer: "<img>",
  },
  {
    question: "What is Flexbox?",
    options: [
      "Programming method",
      "Markup system",
      "Layout model",
      "Styling language",
    ],
    correctAnswer: "Layout model",
  },
  {
    question: "Which symbol is used for comments in JavaScript?",
    options: ["//", "#", "/*", "!-- >"],
    correctAnswer: "//",
  },
  {
    question:
      "Which method is used to add an element to the end of an array in JavaScript?",
    options: ["push()", "add()", "insert()", "append()"],
    correctAnswer: "push()",
  },
  {
    question: "Which HTML tag is used to create lists?",
    options: ["ul", "list", "ol", "li"],
    correctAnswer: "<ul>",
  },
];

//To display question in the browser console
console.log(questions);

//app container where i store all questions
const appContainer = document.getElementById("app-container");
const startButton = document.querySelector(".start-button");
const welcomeSection = document.querySelector(".welcome-section");

startButton.addEventListener("click", startQuiz);
// document.body.addEventListener("load", appContainer.remove());

// Function to clear the entire page content
function clearPage() {
  document.body.innerHTML = ""; // Set the body's inner HTML to an empty string
}

// Variable to keep track of the current question index and points of right answers
let currentQuestionIndex = 0;
let currentQuestionPoints = 0;

// Function to start the quiz
function startQuiz() {
  welcomeSection.remove(); // Remove the welcome section from the DOM
  let quizWindow = document.createElement("div"); // Create a new div for the quiz window
  let quizPointCounter = document.createElement("div"); // Create a new div for the quiz counter of points
  quizPointCounter.innerHTML = `You earned ${currentQuestionPoints}`;
  quizPointCounter.className = "quiz-point-counter"; // Set the class name for styling
  quizWindow.className = "quiz-window"; // Set the class name for styling
  quizWindow.appendChild(quizPointCounter);
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
            rightAnswer.innerHTML = "You are right!"; // Set feedback for correct answer
            rightAnswer.style.color = "white"; // Set text color to white
            currentQuestionPoints++;
            quizPointCounter.innerHTML = `You earned ${currentQuestionPoints} pts.`;
          } else {
            rightAnswer.innerHTML = `Wrong! The answer is ${questions[currentQuestionIndex].correctAnswer}`; // Set feedback for incorrect answer
            rightAnswer.style.backgroundColor = "red"; // Set background color to red
            rightAnswer.style.color = "white"; // Set text color to white
          }

          quizWindow.appendChild(rightAnswer); // Add the feedback to the quiz window
          currentQuestionIndex++; // Move to the next question
          // Show the next question after a delay of 2 seconds
          setTimeout(showQuestion, 2000);
        });

        quizWindow.appendChild(quizChoice); // Add the answer option to the quiz window
        quizWindow.appendChild(quizPointCounter);
      }
    } else {
      // If there are no more questions
      quizWindow.innerHTML = `<h3>Quiz Finished! You earned ${currentQuestionPoints} pts.</h3>`; // Display quiz finished message
      //   appContainer.appendChild(startButton);
    }
  }

  // Show the first question when the quiz starts
  showQuestion();
  // Add the quiz window to the app container in the DOM
  appContainer.appendChild(quizWindow);
}
