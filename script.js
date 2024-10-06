//Create an async function with construction try and catch
async function fetchQuestions() {
  try {
    //declare a variable with method fetch and link to questions
    const response = await fetch("questions.json");
    //status checking (mandatory structure)
    if (!response.ok) {
      throw new Error(`HTTP error! Status ${response.status}`);
    }
    //return a promise and parse text as json
    const questions = await response.json();
    return questions;
    console.log(questions);

    //error checking if there is...
  } catch (error) {
    console.error("Something wrong!:", error);
  }
}
//execute the function and show it on the console.log
fetchQuestions();

// Variable to keep track of the current question index and points of right answers
let currentQuestionIndex = 0;
let currentQuestionPoints = 0;

//app container where i store all questions
const appContainer = document.querySelector(".app-container");
const startButton = document.querySelector(".start-button");
const welcomeSection = document.querySelector(".welcome-section");

startButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const questions = await fetchQuestions();
  startQuiz();
  console.log(questions);
});

function startQuiz() {
  welcomeSection.remove();
  appContainer.classList.add("isActive");

  let computerScience = document.createElement("div");
  let computerGames = document.createElement("div");

  computerGames.classList.add("computer-games");
  computerScience.classList.add("computer-science");

  computerGames.textContent = "Computer Games";
  computerScience.textContent = "Computer Science";

  appContainer.appendChild(computerScience);
  appContainer.appendChild(computerGames);

  computerScience.addEventListener("click", displayComputerQuestions);
  computerGames.addEventListener("click", displayGamesQuestions);
}

function clearPage() {
  appContainer.innerHTML = "";
}

function startComputerScience(questions) {
  clearPage();
  let greetingsBox = document.createElement("div");
  let greetingsHeadline = document.createElement("h2");
  let greetingsParagraph = document.createElement("p");

  greetingsBox.classList.add("center-text");

  greetingsHeadline.textContent = "Welcome to computer science questions!";
  greetingsParagraph.textContent = "Lets get start!";

  greetingsBox.appendChild(greetingsHeadline);
  greetingsBox.appendChild(greetingsParagraph);
  appContainer.appendChild(greetingsBox);

  displayQuestions(questions);
}

//To display questions
function displayQuestions(questions) {
  clearPage();
  if (!Array.isArray(questions)) {
    console.error("Questions is not an array:", questions);
    return;
  }
  questions.forEach((question, index) => {
    let questionDiv = document.createElement("div");
    let questionText = document.createElement("h3");

    questionText.textContent = `${index + 1}. ${question.question}`;

    let optionsList = document.createElement("ul");

    question.options.forEach((option) => {
      let optionItem = document.createElement("li");
      optionItem.textContent = option;
      optionsList.appendChild(optionItem);

      optionItem.addEventListener("click", () =>
        checkAnswer(option, question.correctAnswer)
      );
    });

    questionDiv.appendChild(questionText);
    questionDiv.appendChild(optionsList);
    appContainer.appendChild(questionDiv);
  });
}

function checkAnswer(selectedOption, correctAnswer) {
  if (selectedOption === correctAnswer) {
    console.log("Correct!");
  } else {
    console.log("Wrong answer!");
  }
}

async function displayComputerQuestions() {
  const questionsData = await fetchQuestions();
  const questions = questionsData.computerscience;
  startComputerScience(questions);
}

async function displayGamesQuestions() {
  const questionsData = await fetchQuestions();
  const questions = questionsData.computergames;
  startComputerScience(questions);
}
