import "../src/styles.css"
import React from "react";

const Flashcard = ({ flashcard }) => {
    if (!flashcard) return null;

    return (
        <div className="flashcard">
            <h3>Mistake Type: {flashcard.Mistake_Type}</h3>
            <p>Original Sentence: {flashcard.Original_Sentence}</p>
        </div>
    );
};

export default Flashcard;
