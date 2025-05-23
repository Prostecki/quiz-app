import { fetchQuestions, getCategories } from "./fetchquestions.js";
const appContainer = document.querySelector(".app-container");
const startButton = document.querySelector(".start-button");
const welcomeSection = document.querySelector(".welcome-section");
const showResultsButton = document.querySelector(".stats-table-button");

//The common function that creates an HTML element with optional class and text content
const createElement = (tag, className = "", textContent = "") => {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (textContent) element.textContent = textContent;
  return element;
};

showResultsButton.addEventListener("click", loadScoreboard);

//Load animation of main screen
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    welcomeSection.style.opacity = 1;
    console.log("Begin");
  }, 500);
});

// Variables for quiz
let currentQuestionIndex = 0;
let currentQuestionPoints = 0;
let countdownInterval;
let isQuizCompleted = false;
// Check you user clicked on some answer and it stops to click after giving answer
let isAnswered = false;

// Checking if user clicked on something at all
let answerGiven = false;

//Variable for timer
const timerDuration = 10;

//Loading bar for questions
const timerBox = document.createElement("div");
timerBox.classList.add("timer-box");
const timerBar = document.createElement("div");
timerBar.classList.add("timer-bar");

timerBox.appendChild(timerBar);

//Start a quiz during clicking the button start
startButton.addEventListener("click", (e) => {
  e.preventDefault();
  startQuiz();
});

// Begin app quiz
async function startQuiz() {
  welcomeSection.remove();
  appContainer.classList.add("isActive");

  //Fetching categories from an external API
  const categories = await getCategories();

  if (!categories) {
    console.error("No categories found");
    return;
  }

  //Create category selection dropdown
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
    "Select a category..."
  );

  const selectWrapper = createElement("div", "select-category-wrapper");
  const selectButton = createElement("button", "start-button", "Submit");

  //Start a quiz after selecting a category
  selectButton.addEventListener("click", async () => {
    const selectedId = categorySelect.value;
    console.log(`Selected category ID: ${selectedId}`);

    //Fetch questions for the selected category
    const questions = await fetchQuestions(selectedId);

    //If there are questions, display them
    if (questions && questions.length > 0) {
      displayQuestions(questions);

      //Otherwise, show message
    } else {
      console.error("No questions available");
      const noQuestionsMessage = createElement(
        "p",
        "no-questions-message",
        "No questions available :("
      );
      selectContainer.appendChild(noQuestionsMessage);
    }
  });
  selectWrapper.appendChild(categorySelect);
  selectContainer.append(selectHeadline, selectWrapper, selectButton);
  appContainer.appendChild(selectContainer);
}

// Clear content in appContainer
function clearPage() {
  appContainer.innerHTML = "";
}

// To display questions
function displayQuestions(questions) {
  //Check if the quiz is completed OR if all questions are answered
  if (isQuizCompleted || currentQuestionIndex >= questions.length) {
    return showQuizCompletion();
  }

  //Answer state
  isAnswered = false;
  answerGiven = false;

  //Destructure the question data
  const {
    question,
    incorrect_answers = [],
    correct_answer,
  } = questions[currentQuestionIndex];

  clearPage();

  //Combine and shuffle options
  const options = [...incorrect_answers, correct_answer].sort(
    () => Math.random() - 0.5
  );

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
  const timerDiv = createElement(
    "div",
    "timer",
    `Time left: ${timerDuration} seconds...`
  );
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

  // Creating and adding options for answer
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

  //Start the timer for the current question
  startTimer(
    timerDuration,
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

  //Change flags here
  isAnswered = true;
  answerGiven = true;

  //Stop the timer with global function
  clearInterval(countdownInterval);

  //Highlight the selected option
  optionItem.classList.add("clicked");

  //The universal function that declares classes to variables
  const setClass = (element, className) => element.classList.add(className);

  if (selectedOption === correct_answer) {
    //Increment score if the answer is correct
    currentQuestionPoints++;
    setClass(optionItem, "correct-answer");

    document.querySelector(
      ".total-score"
    ).textContent = `Score: ${currentQuestionPoints} / ${questions.length}`;
    // If it's correct answer, we save a number of score as key, value in local storage
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

  //Change a background color when you gave some answer
  nextQueButton.style.backgroundColor = "green";
  console.log("Next question button enabled");
}

function goToNextQuestion(questions) {
  console.log("Answer given before checking:", answerGiven);

  if (!answerGiven) {
    console.log("No answer given, can not go to next question");
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

  messageDiv.classList.add("showAnswer");

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

  //Declare a variable const with saved localstorage key Score
  const finalScore = localStorage.getItem("Score");
  const inputQuizName = createElement("input", "input-quiz-name");
  inputQuizName.placeholder = "Enter your name...";

  const stopQuizContainer = createElement("div", "stop-quiz-container", "");
  const stopQuizHeadline = createElement(
    "h3",
    "",
    `Congratulations, quiz complete! You earned ${finalScore} points!`
  );
  const saveResultsButton = createElement(
    "button",
    "save-results-button",
    "Save results"
  );
  const leaveButton = createElement("button", "leave-button", "Go home!");
  const completionButtonBox = createElement("div", "stop-quiz-box-button");

  completionButtonBox.append(inputQuizName, saveResultsButton, leaveButton);

  saveResultsButton.addEventListener("click", () => {
    let message = document.createElement("p");

    //Trimmed whitespaces.
    let nickname = inputQuizName.value.trim();

    // It lets to avoid anything that is not a letter or number
    nickname = nickname.replace(/[^a-zA-Z0-9]/g, "");
    if (nickname) {
      addUserScore(nickname, finalScore);
      message.textContent = "You nickname saved successfully!";
      inputQuizName.value = "";
      stopQuizContainer.appendChild(message);
      inputQuizName.disabled = true;
      saveResultsButton.disabled = true;
    } else {
      console.log("Please enter your name before saving results!");
    }
  });
  stopQuizContainer.append(stopQuizHeadline, completionButtonBox);
  appContainer.appendChild(stopQuizContainer);

  leaveButton.addEventListener("click", () => {
    stopQuizContainer.remove();
    location.reload();
    showWelcomeSection();
  });
}

function addUserScore(nickname, points) {
  const currentDate = new Date().toLocaleDateString();
  let scoreboard = JSON.parse(localStorage.getItem("scoreboard")) || [];

  scoreboard.push({ nickname, points, date: currentDate });
  localStorage.setItem("scoreboard", JSON.stringify(scoreboard));

  // loadScoreboard();
}

function loadScoreboard() {
  clearPage();
  const scoreboard = JSON.parse(localStorage.getItem("scoreboard")) || [];
  const scoreBoardContainer = createElement("div", "score-board-container");
  const scoreBoardHeadline = createElement(
    "h2",
    "score-board-headline",
    "Scoreboard"
  );
  const leaveButtonContainer = createElement("div", "leave-button-container");
  const leaveButton = createElement("button", "leave-button", "Quit");

  const scoreTable = document.createElement("table");
  scoreTable.innerHTML = `
    <thead>
      <tr>
        <th>Nickname</th>
        <th>Score</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody id="score-tbody"></tbody>
  `;

  const tbody = scoreTable.querySelector("#score-tbody");
  scoreboard.forEach((score) => {
    const row = `
      <tr>
        <td>${score.nickname}</td>
        <td>${score.points}</td>
        <td>${score.date}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });

  welcomeSection.remove();
  appContainer.classList.add("isActive");
  scoreBoardContainer.appendChild(scoreTable);
  leaveButtonContainer.appendChild(leaveButton);
  appContainer.append(
    scoreBoardHeadline,
    scoreBoardContainer,
    leaveButtonContainer
  );

  leaveButton.addEventListener("click", () => {
    location.reload();
    showWelcomeSection();
  });
}

function showWelcomeSection() {
  welcomeSection.classList.add("active");
}
