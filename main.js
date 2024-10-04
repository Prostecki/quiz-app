//Start the quiz
const startQuiz = document.querySelector(".start-button");

const videoGamesQuestions =
  "https://opentdb.com/api.php?amount=10&category=15&difficulty=medium&type=multiple";
const sportQuestions =
  "https://opentdb.com/api.php?amount=10&category=21&difficulty=medium&type=multiple";
console.log(startQuiz);
startQuiz.addEventListener("click", getDataQuestions);
async function getDataQuestions() {
  try {
    const videoCategory = await fetch(videoGamesQuestions);
    const sportCategory = await fetch(sportQuestions);
    //using promise all to wait for api requests to resolve
    const [response1, response2] = await Promise.all([
      videoCategory,
      sportCategory,
    ]);

    const videoData = await response1.json();
    const sportData = await response2.json();
    console.log(videoData, sportData);
  } catch {
    console.error("Error fetching data from APIs:", error);
  }
}

function renderQuestions(questions) {
  questions.forEach((element) => {
    console.log(element);
  });
}
