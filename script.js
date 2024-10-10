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

// Function of displaying of categories' questions
async function displayQuestionsByCategory(category) {
  const questionsData = await fetchQuestions();
  const questions = questionsData[category];
  startQuizCategory(
    questions,
    category === "computerscience" ? "Computer Science" : "Computer Games"
  );
}

// Begin a quiz
function startQuizCategory(questions, categoryTitle) {
  clearPage();

  const greetingsBox = document.createElement("div");
  greetingsBox.classList.add("greetings-box", "slide-up");

  const greetingsHeadline = document.createElement("h2");
  greetingsHeadline.classList.add("greetings-headline");
  greetingsHeadline.textContent = `Welcome to ${categoryTitle} questions!`;

  const greetingsParagraph = document.createElement("p");
  greetingsParagraph.classList.add("greetings-paragraph");
  greetingsParagraph.textContent = "Let's get started!";

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

  const question = questions[currentQuestionIndex];
  clearPage();

  const questionDiv = document.createElement("div");
  questionDiv.classList.add("question-container");
  const pointsContainer = document.createElement("h2");
  const questionText = document.createElement("h3");
  const timerDiv = document.createElement("div");
  const optionsList = document.createElement("ul");

  pointsContainer.textContent = `Total points: ${currentQuestionPoints}`;
  questionText.textContent = `${currentQuestionIndex + 1}. ${
    question.question
  }`;
  timerDiv.classList.add("timer");
  timerDiv.textContent = "Time left: 10 seconds...";

  isAnswered = false;

  // Creating and adding of options
  question.options.forEach((option) => {
    const optionItem = document.createElement("li");
    optionItem.classList.add("option");
    optionItem.textContent = option;
    optionItem.addEventListener("click", () =>
      handleAnswer(
        option,
        question.correctAnswer,
        questions,
        optionItem,
        optionsList
      )
    );
    optionsList.appendChild(optionItem);
  });

  questionDiv.append(pointsContainer, questionText, optionsList, timerDiv);
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

  if (selectedOption === correctAnswer) {
    currentQuestionPoints++;
    optionItem.classList.add("correct-answer");
  } else {
    optionItem.classList.add("not-correct-answer");
    optionItem.classList.add("wrong");

    optionsList.querySelectorAll("li").forEach((item) => {
      if (item.textContent === correctAnswer) {
        item.classList.add("correct-answer");
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
  const question = questions[currentQuestionIndex];
  const messageDiv = document.createElement("div");
  messageDiv.textContent = `Time is up! Correct answer is ${question.correctAnswer}`;
  // console.log("Time is up! Moving to the next question.");
  appContainer.appendChild(messageDiv);
  currentQuestionIndex++;
  displayQuestions(questions);
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

    if (timeLeft < 0) {
      console.log("Time is up! Moving to the next question.");
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
