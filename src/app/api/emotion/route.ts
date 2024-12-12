import { NextApiRequest, NextApiResponse } from 'next';
import { IamAuthenticator } from 'ibm-watson/auth';
import NaturalLanguageUnderstandingV1 from 'ibm-watson/natural-language-understanding/v1';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

// IBM Watson NLU setup
const nlu = new NaturalLanguageUnderstandingV1({
  version: '2021-08-01',
  authenticator: new IamAuthenticator({ apikey: process.env.IBM_API_KEY || '' }),
  serviceUrl: process.env.IBM_URL,
});

// LastFM API setup
const lastfmApiKey = '2fa6a9b1488886cd63c475f3a6cfe183'; // Replace with your key in .env.local
const lastfmUrl = 'https://ws.audioscrobbler.com/2.0';

// Function to analyze emotion in text using IBM Watson NLU
async function analyzeEmotion(text: string) {
  try {
    const response = await nlu.analyze({
      text,
      features: { emotion: {} },
    });

    const emotions = response.result.emotion?.document?.emotion;
    return emotions || {};
  } catch (error) {
    if ((error as any).message.includes('not enough text')) {
      console.log('Not enough text to analyze emotion');
      return {};
    } else {
      console.error('Error analyzing emotion:', error);
      throw new Error('Failed to analyze emotion');
    }
  }
}

// Function to get LastFM song recommendations based on emotion
async function getLastfmRecommendations(emotion: string) {
  try {
    const params = {
      method: 'tag.gettoptracks',
      tag: emotion, // Emotion used as the tag to filter songs
      api_key: lastfmApiKey,
      format: 'json',
    };

    const response = await axios.get(lastfmUrl, { params });

    if (response.status === 200) {
      return response.data.tracks.track.slice(0, 10);
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching LastFM recommendations:', error);
    return [];
  }
}

// API route handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const recentUserMessage = body?.recentUserMessage || "I am so happy today!";

    const emotions = await analyzeEmotion(recentUserMessage);
    console.log('Emotions:', emotions);

    const emotionScores = emotions as Record<string, number>;
    const dominantEmotion = Object.keys(emotionScores).reduce((a, b) =>
      emotionScores[a] > emotionScores[b] ? a : b, ''
    );

    const topSongs = await getLastfmRecommendations(dominantEmotion);
    console.log('Top Songs based on emotion:', topSongs);

    return NextResponse.json({ emotion: dominantEmotion, songs: topSongs });
  } catch (error) {
    console.error('Error during API processing:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the request' },
      { status: 500 }
    );
  }
}

