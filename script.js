import { fetchQuestions, getCategories } from "./fetchquestions.js";
const appContainer = document.querySelector(".app-container");
const startButton = document.querySelector(".start-button");
const welcomeSection = document.querySelector(".welcome-section");

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    welcomeSection.style.opacity = 1;
    console.log("Begin");
  }, 500);
});

//Declare a variable with questions from JSON file
// const questions = await fetchQuestions();

// Variables
let currentQuestionIndex = 0;
let currentQuestionPoints = 0;
let countdownInterval;
let isQuizCompleted = false;
// Check you user clicked on some answer and it stops to click after giving answer
let isAnswered = false;

// Checking if user clicked on something at all
let answerGiven = false;

//Loading bar for questions
const timerBox = document.createElement("div");
timerBox.classList.add("timer-box");
const timerBar = document.createElement("div");
timerBar.classList.add("timer-bar");

timerBox.appendChild(timerBar);

startButton.addEventListener("click", (e) => {
  e.preventDefault();
  startQuiz();
});

// Begin app quiz
async function startQuiz() {
  welcomeSection.remove();
  appContainer.classList.add("isActive");

  const categories = await getCategories();

  if (!categories) {
    console.error("No categories found");
    return;
  }

  const createElement = (tag, className = "", textContent = "") => {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    if (textContent) element.textContent = textContent;
    return element;
  };

  const categorySelect = document.createElement("select");
  categorySelect.id = "categorySelect";

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });

  const selectContainer = createElement("div", "select-category-container");

  const selectHeadline = createElement(
    "h3",
    "select-headline",
    "Choose your category of questtions"
  );

  const selectButton = createElement("button", "start-button", "Submit");

  // const selectButton = document.createElement("button");
  // selectButton.classList.add("choose-category-button");
  // selectButton.textContent = "Submit a category";

  selectButton.addEventListener("click", async () => {
    const selectedId = categorySelect.value;
    console.log(`Selected category ID: ${selectedId}`);

    const questions = await fetchQuestions(selectedId);

    if (questions && questions.length > 0) {
      displayQuestions(questions);
    } else {
      console.error("No questions available");
    }
  });

  selectContainer.append(selectHeadline, categorySelect, selectButton);
  appContainer.appendChild(selectContainer);

  // appContainer.appendChild(categorySelect);
  // appContainer.appendChild(selectButton);
}

// Clear content in appContainer
function clearPage() {
  appContainer.innerHTML = "";
}

// Function for displaying questions by category
async function displayQuestionsByCategory(categoryId, categoryName) {
  clearPage();
  const questions = await fetchQuestions(categoryId);
  startQuizCategory(questions, categoryName);
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

  isAnswered = false;
  answerGiven = false;

  const {
    question,
    incorrect_answers = [],
    correct_answer,
  } = questions[currentQuestionIndex];

  clearPage();

  const options = [...incorrect_answers, correct_answer].sort(
    () => Math.random() - 0.5
  );

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

  timerBar.style.width = "100%";

  // Creating and adding of options
  options.forEach((option) => {
    const optionItem = createElement("li", "option", option);
    optionItem.addEventListener("click", () =>
      handleAnswer(
        option,
        correct_answer,
        questions,
        optionItem,
        optionsList,
        nextQueButton
      )
    );
    optionsList.appendChild(optionItem);
  });

  bottomBox.append(nextQueButton, timerDiv);

  // bottomBox.appendChild(timerBar);

  questionDiv.append(
    pointsContainer,
    questionText,
    optionsList,
    questionNumber,
    bottomBox,
    timerBox
  );
  appContainer.appendChild(questionDiv);

  nextQueButton.addEventListener("click", () => {
    goToNextQuestion(questions);
  });

  startTimer(
    10,
    () => handleTimeout(optionsList, questions, nextQueButton),
    timerDiv
  );
}

// When u choose an answer
function handleAnswer(
  selectedOption,
  correct_answer,
  questions,
  optionItem,
  optionsList,
  nextQueButton
) {
  if (isAnswered) return;

  isAnswered = true;

  answerGiven = true;

  console.log("Current Question:", questions[currentQuestionIndex]);
  console.log("Correct Answer:", correct_answer);
  console.log("Options:", optionsList);

  console.log("Answer given status:", answerGiven);

  clearInterval(countdownInterval);

  optionItem.classList.add("clicked");

  const setClass = (element, className) => element.classList.add(className);

  if (selectedOption === correct_answer) {
    currentQuestionPoints++;
    setClass(optionItem, "correct-answer");
    document.querySelector(
      ".total-score"
    ).textContent = `Score: ${currentQuestionPoints} / ${questions.length}`;
    // If it's correct answer, we save a number of score as key, value
    localStorage.setItem("Score", currentQuestionPoints);
  } else {
    setClass(optionItem, "not-correct-answer");
    optionsList.querySelectorAll("li").forEach((item) => {
      if (item.textContent === correct_answer) {
        setClass(item, "correct-answer");
      }
    });
  }

  optionsList
    .querySelectorAll("li")
    .forEach((item) => (item.style.pointerEvents = "none"));

  nextQueButton.disabled = false;
  console.log("Next question button enabled");
}

function goToNextQuestion(questions) {
  console.log("Answer given before checking:", answerGiven);

  if (!answerGiven) {
    console.log("no answer given, cannot go to next question");
    return;
  }

  answerGiven = false;
  currentQuestionIndex++;
  console.log("Current Question Index:", currentQuestionIndex);

  if (currentQuestionIndex < questions.length) {
    displayQuestions(questions);
  } else {
    showQuizCompletion();
  }
}

// Handle of time remaining
function handleTimeout(optionsList, questions, nextQueButton) {
  optionsList
    .querySelectorAll("li")
    .forEach((item) => (item.style.pointerEvents = "none"));

  const createElement = (tag, className = "", textContent = "") => {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    if (textContent) element.textContent = textContent;
    return element;
  };

  const { correct_answer } = questions[currentQuestionIndex];

  optionsList.querySelectorAll("li").forEach((item) => {
    if (item.textContent === correct_answer) {
      item.classList.add("correct-answer");
    } else {
      item.classList.add("not-correct-answer");
    }
  });

  console.log(correct_answer);
  const messageDiv = createElement(
    "div",
    "correct-answer-message",
    `Time is up! Correct answer is ${correct_answer}`
  );

  appContainer.appendChild(messageDiv);

  messageDiv.classList.add("active");

  nextQueButton.disabled = false;

  answerGiven = true;
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
    const widthPercentage = (timeLeft / duration) * 100;
    timerBar.style.width = `${widthPercentage}%`;

    if (timeLeft < 1) {
      console.log("Time is up! Moving to the next question.");
      clearInterval(countdownInterval);
      onComplete();
    }
  }, 1000);
}

// Completion of quiz
function showQuizCompletion() {
  if (isQuizCompleted) return;

  clearPage();

  clearInterval(countdownInterval);
  isQuizCompleted = true;

  const createElement = (tag, className = "", textContent = "") => {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    if (textContent) element.textContent = textContent;
    return element;
  };

  //Declare a variable const with saved localstorage key Score
  const finalScore = localStorage.getItem("Score");

  const stopQuizContainer = createElement("div", "stop-quiz-container", "");
  const stopQuizHeadline = createElement(
    "h3",
    "",
    `Congratulations, quiz complete! You earned ${finalScore} points!`
  );
  const startAgainButton = createElement("button", "", "Start again!");
  const leaveButton = createElement("button", "leave-button", "Leave Quiz!");

  const completionButtonBox = createElement("div", "stop-quiz-box-button");

  completionButtonBox.append(startAgainButton, leaveButton);
  stopQuizContainer.append(stopQuizHeadline, completionButtonBox);
  appContainer.appendChild(stopQuizContainer);

  startAgainButton.addEventListener("click", () => {
    //Delete scores in current session
    localStorage.removeItem("Score");
    currentQuestionIndex = 0;
    currentQuestionPoints = 0;
    isQuizCompleted = false;
    clearPage();
    startQuiz();
  });

  leaveButton.addEventListener("click", () => {
    localStorage.clear();
    stopQuizContainer.remove();
    location.reload();
    showWelcomeSection();
  });
}

function showWelcomeSection() {
  welcomeSection.classList.add("active");
}
