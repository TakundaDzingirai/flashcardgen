// App.js
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  createFlashcardsFromMistakes,
  filterFlashcards,
  selectNextCard
} from "./utils";
import StudentIdInput from "../components/StudentIdInput";
import FlashcardSession from "../components/FlashCardSessions";
import "./styles.css";
import { getData } from "./GrammaQuestions";

const Data = getData;

const App = () => {
  const [studentId, setStudentId] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);

  // States for user input and feedback
  const [answer, setAnswer] = useState("");
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Once the user picks a difficulty rating, set this to true
  const [hasGradedCard, setHasGradedCard] = useState(false);

  // On mount, attempt to load existing flashcards from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("flashcards");
    if (stored) {
      setFlashcards(JSON.parse(stored));
    } else {
      setFlashcards(createFlashcardsFromMistakes(Data));
    }
  }, []);

  // Whenever `flashcards` changes, just store them in localStorage
  useEffect(() => {
    if (flashcards.length > 0) {
      localStorage.setItem("flashcards", JSON.stringify(flashcards));
    }
  }, [flashcards]);

  // Whenever STUDENT ID changes, load the first "due" card for that student
  useEffect(() => {
    if (!studentId) {
      setCurrentCard(null);
      return;
    }
    const dueCards = filterFlashcards(studentId, flashcards);
    setCurrentCard(selectNextCard(dueCards));

    // Reset states for a fresh start on a new student's session
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setHasGradedCard(false);
    setAnswer("");
  }, [studentId]);

  // Check answer correctness
  const handleCheckAnswer = () => {
    if (!currentCard) return;
    const userAnswer = answer.trim().toLowerCase();
    const correctAnswer = currentCard.Corrected_Sentence.trim().toLowerCase();
    const result = userAnswer === correctAnswer;

    setIsCorrect(result);
    setIsAnswerChecked(true);
  };

  // Handle spaced repetition review (Easy/Medium/Hard)
  const handleReview = (grade) => {
    if (!currentCard) return;

    // Apply spaced repetition logic
    const updatedCard = { ...currentCard };
    const size_cards = filterFlashcards(studentId, flashcards).length;

    if (grade === "easy") {
      updatedCard.interval = Math.ceil(
        updatedCard.interval * updatedCard.easeFactor + size_cards
      );
      updatedCard.easeFactor = Math.min(updatedCard.easeFactor + 0.15, 2.5); // Limit max easeFactor
    } else if (grade === "medium") {
      updatedCard.interval = Math.ceil(
        updatedCard.interval * updatedCard.easeFactor + size_cards / 2
      );
      updatedCard.easeFactor += 0.1;
    } else if (grade === "hard") {
      updatedCard.interval = Math.max(
        1,
        Math.ceil(updatedCard.interval * updatedCard.easeFactor + 1)
      );
      updatedCard.easeFactor = Math.max(1.3, updatedCard.easeFactor - 0.15); // Minimum easeFactor
    }

    updatedCard.lastReviewed = dayjs().format();
    updatedCard.attempts += 1;
    if (isCorrect) updatedCard.correctCount += 1;

    // Replace old card with updated card in `flashcards`
    const updatedFlashcards = flashcards.map((fc) =>
      fc.Original_Sentence === currentCard.Original_Sentence
        ? updatedCard
        : fc
    );
    setFlashcards(updatedFlashcards);

    // Just mark that we've graded this card. Don't move on yet.
    setHasGradedCard(true);
  };

  // User clicks "Next Card"
  const handleNextCard = () => {
    // Now we pick the next card
    const nextDue = filterFlashcards(studentId, flashcards);
    setCurrentCard(selectNextCard(nextDue));

    // Reset states
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setHasGradedCard(false);
    setAnswer("");
  };

  // Progress calculation
  const studentCards = flashcards.filter(
    (fc) => fc.Student_ID === parseInt(studentId, 10)
  );
  const totalAttempts = studentCards.reduce((sum, fc) => sum + fc.attempts, 0);
  const totalCorrect = studentCards.reduce((sum, fc) => sum + fc.correctCount, 0);
  const accuracy =
    totalAttempts > 0 ? ((totalCorrect / totalAttempts) * 100).toFixed(1) : 0;

  return (
    <div className="App">
      <h2 className="app-heading">Progress Grammar Flashcard App</h2>

      <StudentIdInput studentId={studentId} onChange={setStudentId} />

      {/* Display a quick progress summary for the current student */}
      {studentId && (
        <div style={{ marginTop: "10px", marginBottom: "20px" }}>
          <h3>Progress for Student {studentId}</h3>
          <p>Attempts: {totalAttempts}</p>
          <p>Correct: {totalCorrect}</p>
          <p>Accuracy: {accuracy}%</p>
        </div>
      )}

      {currentCard ? (
        <FlashcardSession
          currentCard={currentCard}
          answer={answer}
          onAnswerChange={setAnswer}
          isAnswerChecked={isAnswerChecked}
          isCorrect={isCorrect}
          hasGradedCard={hasGradedCard}
          onCheckAnswer={handleCheckAnswer}
          onReview={handleReview}
          onNextCard={handleNextCard}
        />
      ) : (
        studentId && <p>No flashcards due for Student ID {studentId}</p>
      )}

      {/* Optional: Show a detailed list of all flashcards with their attempts/correct */}
      {studentId && studentCards.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h3>Detailed Flashcard Stats</h3>
          <ul style={{ textAlign: "left", listStyle: "none", padding: 0 }}>
            {studentCards.map((fc) => {
              const cardAccuracy = fc.attempts
                ? ((fc.correctCount / fc.attempts) * 100).toFixed(1)
                : 0;
              return (
                <li key={fc.Original_Sentence} style={{ margin: "6px 0" }}>
                  <strong>Original:</strong> {fc.Original_Sentence}
                  <br />
                  <strong>Attempts:</strong> {fc.attempts},{" "}
                  <strong>Correct:</strong> {fc.correctCount},{" "}
                  <strong>Accuracy:</strong> {cardAccuracy}%
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
