import "../src/styles.css"
import React from "react";
import Flashcard from "./FlashCard";

const FlashcardSession = ({
    currentCard,
    answer,
    onAnswerChange,
    isAnswerChecked,
    isCorrect,
    onCheckAnswer,
    onReview
}) => {
    if (!currentCard) return null;

    return (
        <>
            <Flashcard flashcard={currentCard} />
            <div className="answer-section">
                {!isAnswerChecked ? (
                    <>
                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => onAnswerChange(e.target.value)}
                            placeholder="Type your corrected sentence"
                            className="answer-input"
                        />
                        <button onClick={onCheckAnswer} className="submit-btn">
                            Submit Answer
                        </button>
                    </>
                ) : (
                    <>
                        {isCorrect ? (
                            <p className="correct">Correct!</p>
                        ) : (
                            <p className="incorrect">
                                Incorrect! The correct sentence is:{" "}
                                {currentCard.Corrected_Sentence}
                            </p>
                        )}
                        <div className="review-buttons">
                            <button onClick={() => onReview("easy")}>Easy</button>
                            <button onClick={() => onReview("medium")}>Medium</button>
                            <button onClick={() => onReview("hard")}>Hard</button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default FlashcardSession;
