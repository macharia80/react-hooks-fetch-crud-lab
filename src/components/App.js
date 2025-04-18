import React, { useState, useEffect } from "react";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState("list"); // 'list' or 'form'

  const [newQuestion, setNewQuestion] = useState({
    prompt: "",
    answer1: "",
    answer2: "",
    correctAnswer: "1",
  });

  // Fetch initial questions from the server
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/api/questions");
        if (!response.ok) throw new Error("Failed to fetch questions");
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuestions();
  }, []);

  // Handle form submission to create a new question
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuestion),
      });

      if (!response.ok) throw new Error("Failed to add question");

      const addedQuestion = await response.json();
      setQuestions((prevQuestions) => [...prevQuestions, addedQuestion]);
      setPage("list");
    } catch (error) {
      console.error(error);
    }
  };

  // Handle deleting a question
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete question");

      setQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Handle updating the correct answer
  const handleCorrectAnswerChange = (id, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === id ? { ...question, correctAnswer: value } : question
      )
    );
  };

  return (
    <div>
      <h1>Quiz App</h1>

      {/* Navigation */}
      <button onClick={() => setPage("list")}>View Questions</button>
      <button onClick={() => setPage("form")}>New Question</button>

      {/* Display Questions */}
      {page === "list" && (
        <ul>
          {questions.map((question) => (
            <li key={question.id}>
              <p>{question.prompt}</p>
              <select
                value={question.correctAnswer}
                onChange={(e) =>
                  handleCorrectAnswerChange(question.id, e.target.value)
                }
              >
                <option value="1">{question.answer1}</option>
                <option value="2">{question.answer2}</option>
              </select>
              <button onClick={() => handleDelete(question.id)}>
                Delete Question
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Form to Add New Question */}
      {page === "form" && (
        <form onSubmit={handleSubmit}>
          <label>
            Prompt:
            <input
              type="text"
              value={newQuestion.prompt}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, prompt: e.target.value })
              }
              placeholder="Enter prompt"
            />
          </label>

          <label>
            Answer 1:
            <input
              type="text"
              value={newQuestion.answer1}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, answer1: e.target.value })
              }
              placeholder="Enter answer 1"
            />
          </label>

          <label>
            Answer 2:
            <input
              type="text"
              value={newQuestion.answer2}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, answer2: e.target.value })
              }
              placeholder="Enter answer 2"
            />
          </label>

          <label>
            Correct Answer:
            <select
              value={newQuestion.correctAnswer}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  correctAnswer: e.target.value,
                })
              }
            >
              <option value="1">Answer 1</option>
              <option value="2">Answer 2</option>
            </select>
          </label>

          <button type="submit">Add Question</button>
        </form>
      )}
    </div>
  );
};

export default App;