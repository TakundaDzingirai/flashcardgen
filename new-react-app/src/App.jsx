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
  const [answer, setAnswer] = useState("");
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Set up initial flashcards on mount and whenever studentId changes
  useEffect(() => {
    const mistakeFlashcards = createFlashcardsFromMistakes(Data);
    setFlashcards(mistakeFlashcards);

    if (studentId) {
      const dueFlashcards = filterFlashcards(studentId, mistakeFlashcards);
      setCurrentCard(selectNextCard(dueFlashcards));
      setIsAnswerChecked(false);
      setAnswer("");
    } else {
      // If no student ID, reset states
      setFlashcards([]);
      setCurrentCard(null);
    }
  }, [studentId]);

  const handleCheckAnswer = () => {
    const userAnswer = answer.trim().toLowerCase();
    const correctAnswer = currentCard.Corrected_Sentence.trim().toLowerCase();
    setIsCorrect(userAnswer === correctAnswer);
    setIsAnswerChecked(true);
  };

  const handleReview = (grade) => {
    const updatedCard = { ...currentCard };

    // Calculate how many flashcards are currently due
    const size_cards = filterFlashcards(studentId, flashcards).length;

    if (grade === "easy") {
      updatedCard.interval = Math.ceil(
        updatedCard.interval * updatedCard.easeFactor + size_cards
      );
      updatedCard.easeFactor += 0.15;
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
      updatedCard.easeFactor = Math.max(1.3, updatedCard.easeFactor - 0.15);
    }

    // Update last reviewed date
    updatedCard.lastReviewed = dayjs().format();

    // Update global flashcards list
    const updatedFlashcards = flashcards.map((fc) =>
      fc.Original_Sentence === currentCard.Original_Sentence ? updatedCard : fc
    );

    setFlashcards(updatedFlashcards);

    // Pick the next card
    const nextDue = filterFlashcards(studentId, updatedFlashcards);
    setCurrentCard(selectNextCard(nextDue));
    setIsAnswerChecked(false);
    setAnswer("");
  };

  return (
    <div className="App">
      <h2>Spaced Repetition Flashcard App</h2>

      <StudentIdInput
        studentId={studentId}
        onChange={(value) => setStudentId(value)}
      />

      {currentCard ? (
        <FlashcardSession
          currentCard={currentCard}
          answer={answer}
          onAnswerChange={setAnswer}
          isAnswerChecked={isAnswerChecked}
          isCorrect={isCorrect}
          onCheckAnswer={handleCheckAnswer}
          onReview={handleReview}
        />
      ) : (
        studentId && <p>No flashcards due for Student ID {studentId}</p>
      )}
    </div>
  );
};

export default App;
