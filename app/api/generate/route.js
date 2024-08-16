import OpenAI from 'openai';

const systemPrompt = `
You are a flashcard creator. Take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
Return in the following JSON format:
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
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    console.error('API key is missing');
    return new Response('API key is missing', { status: 500 });
  }

  const openai = new OpenAI({ apiKey });
  const data = await req.text();

  try {
    console.log('Request data:', data);
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: data },
      ],
      model: 'gpt-3.5-turbo',
    });

    console.log('Completion response:', completion);
    
    // Log the response message content
    const messageContent = completion.choices[0].message.content;
    console.log('Message content:', messageContent);

    // Parse and return the JSON response
    const flashcards = JSON.parse(messageContent);
    return new Response(JSON.stringify(flashcards.flashcards), { status: 200 });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return new Response('Error generating flashcards', { status: 500 });
  }
}
