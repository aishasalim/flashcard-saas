import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function FlashcardSet() {
  const router = useRouter();
  const { id } = router.query; // Get the flashcard set ID from the URL

  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (id) {
        const flashcardsCollectionRef = collection(db, `users/${userId}/flashcardSets/${id}/flashcards`);
        const flashcardsSnapshot = await getDocs(flashcardsCollectionRef);

        const flashcardsData = flashcardsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFlashcards(flashcardsData);
      }
    };

    fetchFlashcards();
  }, [id]);

  return (
    <div>
      <h1>Flashcard Set: {id}</h1>
      {flashcards.length > 0 ? (
        flashcards.map((flashcard, index) => (
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
