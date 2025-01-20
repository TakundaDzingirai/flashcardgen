import React from "react";
import "../src/styles.css";

const FlashcardSession = ({
    currentCard,
    answer,
    onAnswerChange,
    isAnswerChecked,
    isCorrect,
    hasGradedCard,
    onCheckAnswer,
    onReview,
    onNextCard
}) => {
    console.log(isAnswerChecked);
    // if (!currentCard) return null;


    return (
        <div>
            <div className="flashcard-container">
                <div className="flashcard">
                    {/* Show original sentence on the front */}
                    <div className="front">
                        <h2>Mistake Type: {currentCard.Mistake_Type}</h2>
                        <p>Original: {currentCard.Original_Sentence}</p>
                    </div>
                </div>
            </div>

            <div className="answer-section">
                {/* If the user hasn't submitted yet, show input and submit button */}
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
                        {/* Once the user checks the answer, display feedback */}
                        {isCorrect ? (
                            <p className="correct">Correct!</p>
                        ) : (
                            <p className="incorrect">
                                Incorrect! The correct answer is:{" "}
                                {currentCard.Corrected_Sentence}
                            </p>
                        )}

                        {/* Show difficulty buttons if we haven't already graded this card */}
                        {!hasGradedCard && (
                            <div className="review-buttons">
                                <button onClick={() => onReview("easy")}>Easy</button>
                                <button onClick={() => onReview("medium")}>Medium</button>
                                <button onClick={() => onReview("hard")}>Hard</button>
                            </div>
                        )}

                        {/* Once the user has graded the card, show a "Next Card" button */}
                        {hasGradedCard && (
                            <button onClick={onNextCard} style={{ marginTop: "10px" }}>
                                Next Card
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default FlashcardSession;
