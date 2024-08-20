import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '/app/firebase'; // Adjust this path if needed
import { doc, getDoc, setDoc, updateDoc, increment, collection } from 'firebase/firestore';

const systemPrompt = `
You are a flashcard creator. Take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
Return your response in the following JSON format, and only in this format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`;

export async function POST(req) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      console.log('User not authenticated');
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const openai = new OpenAI();
    const data = await req.json();

    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    let userData;
    if (userDocSnap.exists()) {
      userData = userDocSnap.data();
    } else {
      userData = {
        generationCount: 0,
        lastGenerationDate: null,
        subscription: { status: 'base' },
        savedSets: 0
      };
      await setDoc(userDocRef, userData);
    }

    const isPro = userData.subscription?.status === 'pro';
    const today = new Date().toDateString();

    if (!isPro) {
      if (userData.lastGenerationDate !== today) {
        userData.generationCount = 0;
      }
      if (userData.generationCount >= 2) {
        return NextResponse.json({ error: 'Daily generation limit reached' }, { status: 403 });
      }
    }

    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: data.text },
      ],
      model: 'gpt-4o',
    });

    const responseContent = completion.choices[0].message.content;
    let flashcards;
    try {
      flashcards = JSON.parse(responseContent);
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      return NextResponse.json({ error: 'Invalid response format from AI' }, { status: 500 });
    }

    if (!isPro) {
      await updateDoc(userDocRef, {
        generationCount: increment(1),
        lastGenerationDate: today
      });
    }

    return NextResponse.json(flashcards.flashcards);
  } catch (error) {
    console.error('Error in POST /api/generate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { userId } = auth();
    const { setName, flashcards } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return NextResponse.json({ error: 'User document not found' }, { status: 404 });
    }

    const userData = userDocSnap.data();
    const isPro = userData.subscription?.status === 'pro';

    if (!isPro && userData.savedSets >= 1) {
      return NextResponse.json({ error: 'Saving limit reached for non-pro users' }, { status: 403 });
    }

    try {
      const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName);
      await setDoc(setDocRef, { flashcards });

      if (!isPro) {
        await updateDoc(userDocRef, { savedSets: increment(1) });
      }

      return NextResponse.json({ message: 'Flashcard set saved successfully' });
    } catch (error) {
      console.error('Error saving flashcard set:', error);
      return NextResponse.json({ error: 'Failed to save flashcard set' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in PUT /api/generate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}