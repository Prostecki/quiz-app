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

    // Here you can do whatever you want
    console.log(questions);

    //error checking if there is...
  } catch (error) {
    console.error("Something wrong!:", error);
  }
}
//execute the function and show it on the console.log
fetchQuestions();

// Function to clear the entire page content
function clearPage() {
  appContainer.innerHTML = ""; // Set the body's inner HTML to an empty string
}

// Variable to keep track of the current question index and points of right answers
let currentQuestionIndex = 0;
let currentQuestionPoints = 0;

//app container where i store all questions
const appContainer = document.querySelector(".app-container");
const startButton = document.querySelector(".start-button");
const welcomeSection = document.querySelector(".welcome-section");

startButton.addEventListener("click", () => {
  const questions = fetchQuestions();
  startQuiz();
  console.log(questions);
});

function startQuiz() {
  welcomeSection.remove();
  appContainer.classList.add("isActive");
  let computerScience = document.createElement("div");
  computerScience.classList.add("computer-science");
  let computerGames = document.createElement("div");
  computerGames.classList.add("computer-games");
  computerScience.textContent = "Computer Science";
  computerGames.textContent = "Computer Games";
  appContainer.appendChild(computerScience);
  appContainer.appendChild(computerGames);
}
