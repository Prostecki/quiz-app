import { fetchQuestions, getCategories } from "./fetchquestions.js";
const appContainer = document.querySelector(".app-container");
const startButton = document.querySelector(".start-button");
const welcomeSection = document.querySelector(".welcome-section");
const showResultsButton = document.querySelector(".stats-table-button");
const createElement = (tag, className = "", textContent = "") => {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (textContent) element.textContent = textContent;
  return element;
};
showResultsButton.addEventListener("click", loadScoreboard);
// welcomeSection.remove();
// appContainer.appendChild(scoreBoardContainer);

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
    "Select a category..."
  );

  const selectWrapper = createElement("div", "select-category-wrapper");
  const selectButton = createElement("button", "start-button", "Submit");

  selectButton.addEventListener("click", async () => {
    const selectedId = categorySelect.value;
    console.log(`Selected category ID: ${selectedId}`);

    const questions = await fetchQuestions(selectedId);

    if (questions && questions.length > 0) {
      displayQuestions(questions);
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
  const timerDiv = createElement("div", "timer", "Time left: 45 seconds...");
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
    45,
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
  const startAgainButton = createElement("button", "", "Start again!");
  const leaveButton = createElement("button", "leave-button", "Go home!");
  const completionButtonBox = createElement("div", "stop-quiz-box-button");

  completionButtonBox.append(
    inputQuizName,
    saveResultsButton,
    startAgainButton,
    leaveButton
  );

  saveResultsButton.addEventListener("click", () => {
    let message = document.createElement("p");
    const nickname = inputQuizName.value;
    if (nickname) {
      addUserScore(nickname, finalScore);
      message.textContent = "You nickname saved successfully!";
      inputQuizName.value = "";
      stopQuizContainer.appendChild(message);
    } else {
      console.log("Please enter your name before saving results!");
    }
  });
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
    // localStorage.clear();
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
  const scoreBoardHeadline = createElement("h2", "", "Scoreboard");
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
  scoreBoardContainer.append(scoreBoardHeadline, scoreTable, leaveButton);
  appContainer.appendChild(scoreBoardContainer);

  leaveButton.addEventListener("click", () => {
    location.reload();
    showWelcomeSection();
  });
}

function showWelcomeSection() {
  welcomeSection.classList.add("active");
}
