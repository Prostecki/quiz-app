const startQuiz = document.querySelector(".start-button");
console.log(startQuiz);
startQuiz.addEventListener("click", getDataQuestions);
async function getDataQuestions() {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=10&category=15&difficulty=medium&type=multiple"
    );
    const questions = await response.json();
    renderQuestions(questions.results);
  } catch {
    console.error("Something wrong!");
  }
}

function renderQuestions(questions) {
  questions.forEach((element) => {
    console.log(element);
  });
}
