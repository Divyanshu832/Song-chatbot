import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { convertToCoreMessages, Message, StreamingTextResponse, streamText } from 'ai';
// Google Generative AI setup
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY as string,
});


// Google Generative AI model setup
const model = google('gemini-1.5-pro');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages }: { messages: Array<Message>} = body;
    
    const coreMessages = convertToCoreMessages(messages).filter((message) => message.content.length > 0) || [];
    // Generate response using Google Generative AI
    const result = await streamText({
      model,
      messages: coreMessages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error during chat completion:", error);
    return new Response("Error occurred while generating a response.", { status: 500 });
  }
}