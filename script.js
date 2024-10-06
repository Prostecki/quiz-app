async function fetchQuestions() {
  try {
    const response = await fetch("questions.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status ${response.status}`);
    }
    const questions = await response.json();
    console.log(questions);
  } catch (error) {
    console.error("Something wrong!:", error);
  }
}
fetchQuestions();

//app container where i store all questions
const appContainer = document.getElementById("app-container");
const startButton = document.querySelector(".start-button");
const welcomeSection = document.querySelector(".welcome-section");

// window.addEventListener("DOMContentLoaded", () => {
//   appContainer.remove();
// });

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
  welcomeSection.remove(); // Remove the welcome section from the DOM;
  appContainer.style.display = "block";
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
      let finishHeadline = document.createElement("h3");
      finishHeadline.className = "finish-headline";
      finishHeadline.innerHTML = `Quiz Finished! You earned ${currentQuestionPoints} pts.`;
      quizWindow.appendChild(finishHeadline);
      //   quizWindow.innerHTML = `<h3>Quiz Finished! You earned ${currentQuestionPoints} pts.</h3>`; // Display quiz finished message
      //   appContainer.appendChild(startButton);
    }
  }

  // Show the first question when the quiz starts
  showQuestion();
  // Add the quiz window to the app container in the DOM
  appContainer.appendChild(quizWindow);
}
