"use client";
import { useChat } from "ai/react";
import { useState } from "react";
import GPTLogo from "./components/GPTLogo";
import radio from "/radio.png";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  const [response, setResponse] = useState<{ emotion: string; songs: any[] } | null>(null);

  const customHandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Call useChat's handleSubmit to process the chat message
    handleSubmit(e);

    try {
      const res = await fetch("/api/emotion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recentUserMessage: input }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response from API");
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error("Error:", err);
      setResponse(null);
    }
  };

  const sanitizeContent = (content: string) => {
    return content.replace(/[*@#]/g, "");
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-grow overflow-hidden">
        {/* Left Section: First 5 Songs */}
        <div className="w-1/4 p-4 bg-gray-100">
          {response && (
            <>
              <h2 className="font-bold mb-2">Emotion: {response.emotion}</h2>
              <ul>
                {response.songs.slice(0, 5).map((song, index) => (
                  <li key={index} className="mb-2 flex items-center">
                    <img
                      src="/radio.png" // Replace with a default image if missing
                      alt={song.name}
                      className="w-10 h-10 mr-2"
                    />
                    <a
                      href={song.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {song.name}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Center Section: Chatbot */}
        <div className="w-1/2 p-4 flex flex-col">
            <div className="w-full pb-4">
              <h1 className="text-4xl text-center text-fuchsia-600 font-semibold font-serif">Song Recommendation Chatbot</h1>
            </div>
          <div className="overflow-y-auto flex-grow">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`border-t border-black/10 ${
                  message.role === "assistant" && "bg-gray-50"
                }`}
              >
                <div className="max-w-3xl mx-auto py-6 flex">
                  {message.role === "assistant" && <GPTLogo />}
                  <span className="ml-3">{sanitizeContent(message.content)}</span>
                </div>
              </div>
            ))}
          </div>
          <form className="mt-4" onSubmit={customHandleSubmit}>
            <input
              className="w-full shadow-xl h-12 rounded-md border border-input bg-background px-4 text-sm"
              placeholder="Send a message"
              value={input}
              onChange={handleInputChange}
            />
          </form>
        </div>

        {/* Right Section: Last 5 Songs */}
        <div className="w-1/4 p-4 bg-gray-100">
          {response && (
            <>
              <h2 className="font-bold mb-2">Emotion: {response.emotion}</h2>
              <ul>
                {response.songs.slice(-5).map((song, index) => (
                  <li key={index} className="mb-2 flex items-center">
                    <img
                      src="/radio.png" // Replace with a default image if missing
                      alt={song.name}
                      className="w-10 h-10 mr-2"
                    />
                    <a
                      href={song.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {song.name}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}