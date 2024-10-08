import { fetchQuestions } from "./fetchquestions.js";
//execute the function and show it on the console.log

// Variable to keep track of the current question index and points of right answers
let currentQuestionIndex = 0;
let currentQuestionPoints = 0;

//app container where i store all questions
const appContainer = document.querySelector(".app-container");
const startButton = document.querySelector(".start-button");
const welcomeSection = document.querySelector(".welcome-section");

startButton.addEventListener("click", (e) => {
  e.preventDefault();
  startQuiz();
});

function createCategoryButton(text, className, onClick) {
  let categoryDiv = document.createElement("div");
  categoryDiv.classList.add(className);
  categoryDiv.textContent = text;
  categoryDiv.addEventListener("click", onClick);
  appContainer.appendChild(categoryDiv);
}

function startQuiz() {
  welcomeSection.remove();
  appContainer.classList.add("isActive");

  let currentQuestionIndex = 0;
  let currentQuestionPoints = 0;

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

function clearPage() {
  appContainer.innerHTML = "";
}

function startQuizCategory(questions, categoryTitle) {
  clearPage();

  let greetingsBox = document.createElement("div");
  greetingsBox.classList.add("center-text");

  let greetingsHeadline = document.createElement("h2");
  greetingsHeadline.textContent = `Welcome to ${categoryTitle} questions!`;

  let greetingsParagraph = document.createElement("p");
  greetingsParagraph.textContent = "Let's get started!";

  greetingsBox.appendChild(greetingsHeadline);
  greetingsBox.appendChild(greetingsParagraph);
  appContainer.appendChild(greetingsBox);

  setTimeout(() => {
    displayQuestions(questions);
  }, 1500);
}

function displayComputerQuestions() {
  displayQuestionsByCategory("computerscience");
}

function displayGamesQuestions() {
  displayQuestionsByCategory("computergames");
}

async function displayQuestionsByCategory(category) {
  const questionsData = await fetchQuestions();
  const questions = questionsData[category];
  startQuizCategory(
    questions,
    category === "computerscience" ? "Computer Science" : "Computer Games"
  );
}

// To display questions
function displayQuestions(questions) {
  clearPage();

  if (currentQuestionIndex >= questions.length) {
    showQuizCompletion();
    return;
  }

  const question = questions[currentQuestionIndex];
  let questionDiv = document.createElement("div");
  let questionText = document.createElement("h3");
  questionText.textContent = `${currentQuestionIndex + 1}. ${
    question.question
  }`;

  let optionsList = document.createElement("ul");

  question.options.forEach((option) => {
    let optionItem = document.createElement("li");
    optionItem.textContent = option;
    optionItem.addEventListener("click", () => {
      checkAnswer(option, question.correctAnswer, questions);
    });
    optionsList.appendChild(optionItem);
  });

  questionDiv.appendChild(questionText);
  questionDiv.appendChild(optionsList);
  appContainer.appendChild(questionDiv);
}

function checkAnswer(selectedOption, correctAnswer, questions) {
  if (selectedOption === correctAnswer) {
    console.log("Correct!");
  } else {
    console.log("Wrong answer!");
  }
  currentQuestionIndex++;
  displayQuestions(questions);
}

function showQuizCompletion() {
  let stopQuizContainer = document.createElement("div");
  let stopQuizHeadline = document.createElement("h3");
  stopQuizHeadline.textContent = "Quiz complete!";
  stopQuizContainer.appendChild(stopQuizHeadline);
  appContainer.appendChild(stopQuizContainer);
  console.log("Quiz complete!");
  setTimeout(() => {
    stopQuizContainer.remove();
    startQuiz();
  }, 2000);
}
