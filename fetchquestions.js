//Create an async function with construction try and catch
export async function fetchQuestions() {
  try {
    //declare a variable with method fetch and link to questions
    const questions = await fetchData("questions.json");
    return questions;
  } catch (error) {
    console.error("Something wrong!:", error);
  }
}

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Something wrong!:", error);
    throw error;
  }
}
