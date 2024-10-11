import { fetchQuestions } from "./fetchquestions.js";

// Variables
let currentQuestionIndex = 0;
let currentQuestionPoints = 0;
let countdownInterval;
let isQuizCompleted = false;
let isAnswered = false;

const appContainer = document.querySelector(".app-container");
const startButton = document.querySelector(".start-button");
const welcomeSection = document.querySelector(".welcome-section");

//Declare a variable with questions from JSON file
const questions = await fetchQuestions();
console.log(questions);

startButton.addEventListener("click", (e) => {
  e.preventDefault();
  startQuiz();
});

// Create buttons for categories
function createCategoryButton(text, className, onClick) {
  const categoryDiv = document.createElement("div");
  categoryDiv.classList.add(className);
  categoryDiv.textContent = text;
  categoryDiv.addEventListener("click", onClick);
  appContainer.appendChild(categoryDiv);
}

// Begin app quiz
function startQuiz() {
  welcomeSection.remove();
  appContainer.classList.add("isActive");

  createCategoryButton(
    "Computer Science",
    "computer-science",
    displayComputerQuestions
  );
  createCategoryButton(
    "Computer Games",
    "computer-games",
    displayGamesQuestions
  );
}

// Clear content in appContainer
function clearPage() {
  appContainer.innerHTML = "";
}

// Function for displaying questions by category
function displayQuestionsByCategory(category) {
  const categoryName =
    category === "computerscience" ? "Computer Science" : "Computer Games";
  startQuizCategory(questions[category], categoryName);
}

// Begin a quiz
function startQuizCategory(questions, categoryTitle) {
  clearPage();

  const createElement = (tag, className, text = "") => {
    const element = document.createElement(tag);
    if (className) element.classList.add(...className.split(" "));
    if (text) element.textContent = text;
    return element;
  };

  const greetingsBox = createElement("div", "greetings-box slide-up");
  const greetingsHeadline = createElement(
    "h2",
    "greetings-headline",
    `Welcome to ${categoryTitle} questions!`
  );
  const greetingsParagraph = createElement(
    "p",
    "greetings-paragraph",
    "Let's get started!"
  );

  greetingsBox.append(greetingsHeadline, greetingsParagraph);
  appContainer.appendChild(greetingsBox);

  setTimeout(() => {
    greetingsBox.classList.add("hidden");
    setTimeout(() => {
      displayQuestions(questions);
      greetingsBox.remove();
    }, 500);
  }, 1500);
}

// To display questions
function displayQuestions(questions) {
  if (isQuizCompleted || currentQuestionIndex >= questions.length) {
    return showQuizCompletion();
  }

  const { question, options, correctAnswer } = questions[currentQuestionIndex];

  clearPage();

  const createElement = (tag, className = "", textContent = "") => {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    if (textContent) element.textContent = textContent;
    return element;
  };

  const questionDiv = createElement("div", "question-container");
  const pointsContainer = createElement(
    "div",
    "total-score",
    `Score: ${currentQuestionPoints} / ${questions.length}`
  );
  const questionText = createElement(
    "h3",
    "",
    `${currentQuestionIndex + 1}. ${question}`
  );
  const timerDiv = createElement("div", "timer", "Time left: 10 seconds...");
  const optionsList = createElement("ul");
  const nextQueButton = createElement("button", "next-question-button", "Next");
  const questionNumber = createElement(
    "h2",
    "question-number",
    `${currentQuestionIndex + 1} of ${questions.length} questions`
  );

  const bottomBox = createElement("div", "bottom-box-question");

  isAnswered = false;

  // Creating and adding of options
  options.forEach((option) => {
    const optionItem = createElement("li", "option", option);
    optionItem.addEventListener("click", () =>
      handleAnswer(option, correctAnswer, questions, optionItem, optionsList)
    );
    optionsList.appendChild(optionItem);
  });

  bottomBox.append(nextQueButton, timerDiv);

  questionDiv.append(
    pointsContainer,
    questionText,
    optionsList,
    questionNumber,
    bottomBox
  );
  appContainer.appendChild(questionDiv);

  startTimer(10, () => handleTimeout(optionsList, questions), timerDiv);
}

// When u choose an answer
function handleAnswer(
  selectedOption,
  correctAnswer,
  questions,
  optionItem,
  optionsList
) {
  if (isAnswered) return;

  isAnswered = true;
  clearInterval(countdownInterval);

  optionItem.classList.add("clicked");

  const setClass = (element, className) => element.classList.add(className);

  if (selectedOption === correctAnswer) {
    currentQuestionPoints++;
    setClass(optionItem, "correct-answer");
  } else {
    setClass(optionItem, "wrong");
    optionsList.querySelectorAll("li").forEach((item) => {
      if (item.textContent === correctAnswer) {
        setClass(item, "correct-answer");
      }
    });
  }

  optionsList
    .querySelectorAll("li")
    .forEach((item) => (item.style.pointerEvents = "none"));

  setTimeout(() => {
    currentQuestionIndex++;
    displayQuestions(questions);
  }, 1500);
}

// Handle of time remaining
function handleTimeout(optionsList, questions) {
  optionsList
    .querySelectorAll("li")
    .forEach((item) => (item.style.pointerEvents = "none"));

  const createElement = (tag, className = "", textContent = "") => {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    if (textContent) element.textContent = textContent;
    return element;
  };

  const { correctAnswer } = questions[currentQuestionIndex];
  console.log(correctAnswer);
  const messageDiv = createElement(
    "div",
    "correct-answer-message",
    `Time is up! Correct answer is ${correctAnswer}`
  );

  appContainer.appendChild(messageDiv);

  setTimeout(() => {
    currentQuestionIndex++;
    displayQuestions(questions);
  }, 3000);
}

// Timer function
function startTimer(duration, onComplete, timerDiv) {
  let timeLeft = duration;
  countdownInterval = setInterval(() => {
    if (isQuizCompleted) {
      clearInterval(countdownInterval);
      return;
    }

    timeLeft--;
    timerDiv.textContent = `Time left: ${timeLeft} seconds...`;

    if (timeLeft < 1) {
      console.log("Time is up! Moving to the next question.");
      // console.log("The correct answer is...", questions.correctAnswer);
      clearInterval(countdownInterval);
      onComplete();
    }
  }, 1000);
}

// Completion of quiz
function showQuizCompletion() {
  if (isQuizCompleted) return;

  clearInterval(countdownInterval);
  isQuizCompleted = true;

  const stopQuizContainer = document.createElement("div");
  const stopQuizHeadline = document.createElement("h3");
  const startAgainButton = document.createElement("button");
  const leaveButton = document.createElement("button");

  stopQuizHeadline.textContent = `Congratulations, quiz complete! You earned ${currentQuestionPoints} points!`;
  startAgainButton.textContent = "Start again!";
  leaveButton.textContent = "Leave Quiz";

  startAgainButton.classList.add("start-again-button");
  leaveButton.classList.add("leave-button");

  stopQuizContainer.append(stopQuizHeadline, startAgainButton, leaveButton);
  appContainer.appendChild(stopQuizContainer);

  startAgainButton.addEventListener("click", () => {
    currentQuestionIndex = 0;
    currentQuestionPoints = 0;
    isQuizCompleted = false;
    startQuiz();
  });

  leaveButton.addEventListener("click", () => stopQuizContainer.remove());
}

// Functions for categories
function displayComputerQuestions() {
  displayQuestionsByCategory("computerscience");
}

function displayGamesQuestions() {
  displayQuestionsByCategory("computergames");
}
