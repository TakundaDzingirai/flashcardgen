// utils.js
import dayjs from "dayjs";

export const createFlashcardsFromMistakes = (data) => {
    return data.map((mistake) => ({
        Student_ID: mistake.Student_ID,
        Mistake_Type: mistake.Mistake_Type,
        Original_Sentence: mistake.Original_Sentence,
        Corrected_Sentence: mistake.Corrected_Sentence,
        interval: 1,
        lastReviewed: null,
        easeFactor: 2.5,
    }));
};

export const filterFlashcards = (studentId, allFlashcards) => {
    const studentFlashcards = allFlashcards.filter(
        (f) => f.Student_ID === parseInt(studentId, 10)
    );

    const dueFlashcards = studentFlashcards.filter((card) => {
        if (!card.lastReviewed) return true;
        const nextReview = dayjs(card.lastReviewed).add(
            Math.ceil(card.interval * card.easeFactor),
            "day"
        );
        return dayjs().isAfter(nextReview);
    });

    if (dueFlashcards.length > 0) {
        return dueFlashcards;
    }

    // No flashcards are “due”, so show the ones with the nearest next review date
    const sortedFlashcards = studentFlashcards
        .map((card) => ({
            ...card,
            nextReview: dayjs(card.lastReviewed).add(
                Math.ceil(card.interval * card.easeFactor),
                "day"
            ),
        }))
        .sort((a, b) => a.nextReview - b.nextReview);

    const shortestTime = sortedFlashcards[0]?.nextReview;

    return sortedFlashcards.filter((card) =>
        card.nextReview.isSame(shortestTime)
    );
};

export const selectNextCard = (dueFlashcards) => {
    if (dueFlashcards.length > 0) {
        const randomIndex = Math.floor(Math.random() * dueFlashcards.length);
        return dueFlashcards[randomIndex];
    }
    return null;
};
