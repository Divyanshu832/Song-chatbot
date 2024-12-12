"use client";
import { useEffect, useState } from 'react';

const EmotionPage = () => {
  const [dominantEmotion, setDominantEmotion] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch the dominant emotion from the API
    const fetchEmotion = async () => {
      setLoading(true);
      setError(null); // Reset error before fetching

      try {
        const response = await fetch('/api/emotion'); // Assuming the endpoint for emotion analysis is '/api/emotion'
        
        if (!response.ok) {
          throw new Error('Failed to fetch emotion data');
        }

        const data = await response.json();
        setDominantEmotion(data.dominantEmotion); // Set the dominant emotion from the response
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEmotion();
  }, []); // Empty dependency array to fetch on component mount

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-semibold text-center mb-4">Emotion Analysis</h1>

        {loading && <p className="text-center text-gray-500">Loading...</p>}

        {error && <p className="text-center text-red-500">{error}</p>}

        {dominantEmotion && !loading && (
          <div className="text-center">
            <p className="text-lg font-medium">Dominant Emotion:</p>
            <p className="text-xl text-blue-600 font-bold">{dominantEmotion}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionPage;
