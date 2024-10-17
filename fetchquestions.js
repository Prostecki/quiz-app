// //Create an async function with construction try and catch
// export async function fetchQuestions() {
//   try {
//     //declare a variable with method fetch and link to questions
//     const questions = await fetchData("questions.json");
//     return questions;
//   } catch (error) {
//     console.error("Something wrong!:", error);
//   }
// }

// async function fetchData(url) {
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status ${response.status}`);
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Something wrong!:", error);
//     throw error;
//   }
// }

const numberOfQuestions = 10;
const difficulty = "easy";
const questionType = "multiple";

const urlCat = "https://opentdb.com/api_category.php";

export async function getCategories() {
  try {
    const response = await fetch(urlCat);
    if (!response.ok) {
      throw new Error("HTTP request error");
    }
    const data = await response.json();
    const categories = data.trivia_categories;

    console.log("Available categories:", categories);

    return categories;
  } catch (error) {
    console.error("Something went wrong:", error);
  }
}

// Функция для получения вопросов по выбранной категории
export async function fetchQuestions(categoryId) {
  const url = `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${categoryId}&difficulty=${difficulty}&type=${questionType}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("HTTP request error");
    }

    const data = await response.json();
    const questions = data.results.map((q) => ({
      ...q,
      question: decodeHtmlEntities(q.question),
      correct_answer: decodeHtmlEntities(q.correct_answer),
      incorrect_answers: q.incorrect_answers.map(decodeHtmlEntities),
    }));

    console.log("Fetched Questions:", questions);

    return questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

getCategories();

function decodeHtmlEntities(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}
