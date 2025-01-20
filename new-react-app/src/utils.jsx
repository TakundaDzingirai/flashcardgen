// utils.js
import dayjs from "dayjs";

/**
 * Convert raw mistakes data into flashcard objects,
 * adding fields for spaced repetition.
 */
export const createFlashcardsFromMistakes = (data) => {
    return data.map((mistake) => ({
        Student_ID: mistake.Student_ID,
        Mistake_Type: mistake.Mistake_Type,
        Original_Sentence: mistake.Original_Sentence,
        Corrected_Sentence: mistake.Corrected_Sentence,

        // Spaced repetition fields
        interval: 1,
        easeFactor: 2.5,
        lastReviewed: null,

        // Progress tracking
        attempts: 0,
        correctCount: 0,
    }));
};

/**
 * Filter flashcards for a specific student
 * and return only those that are due now OR next due.
 */
export const filterFlashcards = (studentId, allFlashcards) => {
    const studentFlashcards = allFlashcards.filter(
        (f) => f.Student_ID === parseInt(studentId, 10)
    );

    // 1. Get due flashcards (not reviewed yet, or nextReview <= now)
    const dueFlashcards = studentFlashcards.filter((card) => {
        if (!card.lastReviewed) return true; // never reviewed => due
        const nextReviewDate = dayjs(card.lastReviewed).add(
            Math.ceil(card.interval * card.easeFactor),
            "day"
        );
        return dayjs().isAfter(nextReviewDate);
    });

    if (dueFlashcards.length > 0) {
        return dueFlashcards;
    }

    // 2. If no cards are strictly due, pick the earliest next review group
    const sortedFlashcards = studentFlashcards
        .map((card) => ({
            ...card,
            nextReview: dayjs(card.lastReviewed).add(
                Math.ceil(card.interval * card.easeFactor),
                "day"
            ),
        }))
        .sort((a, b) => a.nextReview - b.nextReview);

    const earliestDate = sortedFlashcards[0]?.nextReview;
    return sortedFlashcards.filter((card) => card.nextReview.isSame(earliestDate));
};

/**
 * Randomly select a card from the array of due flashcards.
 */
export const selectNextCard = (dueFlashcards) => {
    if (dueFlashcards.length > 0) {
        const randomIndex = Math.floor(Math.random() * dueFlashcards.length);
        return dueFlashcards[randomIndex];
    }
    return null;
};
