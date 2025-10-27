
import React, { useState, useRef, useEffect } from 'react';
import type { Chat, GenerateContentResponse } from '@google/genai';
import { createTutoringSession, streamFirstMessage, streamMessage } from './services/geminiService';
import { fileToGenerativePart } from './utils/fileUtils';
import type { Message } from './types';
import { BrainIcon, SendIcon, UploadIcon } from './components/icons';

// Fix: Changed component signature to accept props of type Message to avoid TypeScript error.
const ChatBubble = (props: Message) => (
  <div className={`flex ${props.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`max-w-prose rounded-2xl px-4 py-3 shadow-lg ${
      props.role === 'user'
        ? 'bg-blue-600 text-white rounded-br-none'
        : 'bg-gray-700 text-gray-200 rounded-bl-none'
    }`}>
      <p className="whitespace-pre-wrap">{props.text}</p>
    </div>
  </div>
);

const LoadingBubble = () => (
  <div className="flex justify-start mb-4">
    <div className="max-w-prose rounded-2xl px-4 py-3 shadow-lg bg-gray-700 text-gray-200 rounded-bl-none">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse [animation-delay:0.2s]"></div>
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse [animation-delay:0.4s]"></div>
      </div>
    </div>
  </div>
);

export default function App() {
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am your Socratic math tutor. Please upload a photo of a math problem to get started.' }
  ]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [userInput, setUserInput] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setChatHistory([{ role: 'model', text: 'Image loaded. Click "Start Tutoring" to begin.' }]);
      setChatSession(null);
    }
  };

  const handleStartTutoring = async () => {
    if (!image) return;
    setIsLoading(true);
    setChatHistory([]);
    
    try {
      const newChatSession = await createTutoringSession(isThinkingMode);
      setChatSession(newChatSession);
      
      const imagePart = await fileToGenerativePart(image);
      const stream = await streamFirstMessage(newChatSession, imagePart, "Analyze this math problem and explain only the very first step to solve it.");

      let currentResponse = '';
      setChatHistory([{ role: 'model', text: '' }]);

      for await (const chunk of stream) {
        currentResponse += chunk.text;
        setChatHistory([{ role: 'model', text: currentResponse }]);
      }
    } catch (error) {
      console.error(error);
      setChatHistory([{ role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fix: Refactored sendMessage to use safer state update patterns.
  const sendMessage = async (message: string) => {
    if (!chatSession || !message.trim()) return;

    setIsLoading(true);
    const userMessage: Message = { role: 'user', text: message };
    setChatHistory(prev => [...prev, userMessage, { role: 'model', text: '' }]);
    setUserInput('');

    try {
      const stream = await streamMessage(chatSession, message);
      let currentResponse = '';

      for await (const chunk of stream) {
        currentResponse += chunk.text;
        setChatHistory(prev => {
          const updatedHistory = [...prev];
          updatedHistory[updatedHistory.length - 1] = { role: 'model', text: currentResponse };
          return updatedHistory;
        });
      }
    } catch (error) {
      console.error(error);
      setChatHistory(prev => {
        const updatedHistory = [...prev];
        if (updatedHistory.length > 0) {
          updatedHistory[updatedHistory.length - 1] = { role: 'model', text: 'Sorry, something went wrong.' };
        }
        return updatedHistory;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleThinkingMode = () => {
    const newMode = !isThinkingMode;
    setIsThinkingMode(newMode);
    
    setChatSession(null);
    setImage(null);
    setImagePreview(null);
    setChatHistory([
      { role: 'model', text: `Deep Thinking Mode is now ${newMode ? 'ON' : 'OFF'}. The next session will use a more powerful model. Please upload a new math problem.` }
    ]);
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-gray-900 font-sans">
      {/* Left Panel */}
      <div className="w-full md:w-1/3 xl:w-1/4 p-4 md:p-6 flex flex-col border-b md:border-b-0 md:border-r border-gray-700 bg-gray-800/50">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Socratic Math Tutor
          </h1>
          <p className="text-gray-400 mt-1">Your patient AI guide to mastering math.</p>
        </header>

        <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:bg-gray-700/50 transition-all duration-300"
        >
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
          {imagePreview ? (
            <img src={imagePreview} alt="Math problem preview" className="max-h-60 w-auto rounded-lg object-contain" />
          ) : (
            <>
              <UploadIcon className="w-12 h-12 text-gray-500 mb-4" />
              <p className="text-gray-400 text-center">Click to upload a photo of your math problem</p>
            </>
          )}
        </div>
        
        <button
          onClick={handleStartTutoring}
          disabled={!image || isLoading}
          className="w-full mt-6 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg"
        >
          {isLoading ? 'Thinking...' : 'Start Tutoring'}
        </button>

        <div className="mt-auto pt-6">
           <div className="flex items-center justify-between bg-gray-700/60 p-3 rounded-lg">
             <div className="flex items-center space-x-3">
                <BrainIcon className="w-6 h-6 text-purple-400" />
                <label htmlFor="thinking-mode" className="font-medium text-gray-300">Deep Thinking Mode</label>
             </div>
             <button
                role="switch"
                aria-checked={isThinkingMode}
                onClick={handleToggleThinkingMode}
                className={`${isThinkingMode ? 'bg-purple-600' : 'bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
              >
                <span className={`${isThinkingMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
              </button>
           </div>
           <p className="text-xs text-gray-500 mt-2 text-center">For very complex problems. Uses gemini-2.5-pro.</p>
        </div>

      </div>

      {/* Right Panel (Chat) */}
      <div className="flex-1 flex flex-col p-4 md:p-6 h-full overflow-hidden">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {chatHistory.map((msg, index) => (
            <ChatBubble key={index} role={msg.role} text={msg.text} />
          ))}
          {isLoading && chatHistory.length > 0 && <LoadingBubble />}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-2">
             <button
              onClick={() => sendMessage("Why did we do that? Please explain the concept behind the last step.")}
              disabled={isLoading || !chatSession}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              Why did we do that?
            </button>
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(userInput); }} className="flex-1 flex items-center relative">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={chatSession ? "Type your answer or next question..." : "Start a session first..."}
                disabled={isLoading || !chatSession}
                className="w-full bg-gray-700 text-gray-200 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button type="submit" disabled={isLoading || !chatSession} className="absolute right-3 text-gray-400 hover:text-blue-500 disabled:hover:text-gray-400 disabled:opacity-50 transition-colors">
                <SendIcon className="w-6 h-6" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add some global styles for a custom scrollbar if needed.
const style = document.createElement('style');
style.textContent = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #1f2937; /* bg-gray-800 */
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #4b5563; /* bg-gray-600 */
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #6b7280; /* bg-gray-500 */
  }
`;
document.head.append(style);
