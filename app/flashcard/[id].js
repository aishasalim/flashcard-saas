import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function FlashcardSet() {
  const router = useRouter();
  const { id, flashcards } = router.query; // `id` corresponds to the flashcard set ID

  // Parse the flashcards if passed as a query string
  const [parsedFlashcards, setParsedFlashcards] = useState([]);

  useEffect(() => {
    if (flashcards) {
      try {
        setParsedFlashcards(JSON.parse(flashcards));
      } catch (error) {
        console.error('Error parsing flashcards:', error);
      }
    }
  }, [flashcards]);

  return (
    <div>
      <h1>Flashcard Set: {id}</h1>
      {parsedFlashcards.length > 0 ? (
        parsedFlashcards.map((flashcard, index) => (
          <div key={index}>
            <p><strong>Front:</strong> {flashcard.front}</p>
            <p><strong>Back:</strong> {flashcard.back}</p>
          </div>
        ))
      ) : (
        <p>No flashcards available</p>
      )}
    </div>
  );
}

