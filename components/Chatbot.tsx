import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { ChatMessage } from '../types.ts';
import { SendIcon, UserIcon, ModelIcon, SpinnerIcon } from './Icons.tsx';
import { useApp } from '../hooks/useApp.ts';

export const Chatbot: React.FC = () => {
  const { translations: t } = useApp();
  const [chat, setChat] = useState<Chat | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setError('API_KEY environment variable is not set.');
      return;
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chatSession = ai.chats.create({ 
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'You are a helpful and friendly assistant for the Accenture Academy. Answer questions clearly and concisely.'
        }
    });
    setChat(chatSession);
    setHistory([
        { role: 'model', text: t.chatbotInitialMessage }
    ]);
  }, [t.chatbotInitialMessage]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !chat || isLoading) return;

    const messageText = userInput.trim();
    setUserInput('');
    setHistory(prev => [...prev, { role: 'user', text: messageText }]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await chat.sendMessage({ message: messageText });
      const modelResponse = response.text;
      setHistory(prev => [...prev, { role: 'model', text: modelResponse }]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(t.chatbotError);
    } finally {
      setIsLoading(false);
    }
  };

  const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.role === 'user';
    return (
      <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''} animate-fade-in`}>
        {!isUser && <div className="p-1.5 rounded-full bg-primary text-white flex-shrink-0 shadow"><ModelIcon className="w-5 h-5" /></div>}
        <div className={`max-w-xl p-3.5 rounded-2xl shadow-sm ${isUser ? 'bg-primary text-white rounded-br-lg' : 'bg-slate-100 text-slate-800 rounded-bl-lg'}`}>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
        </div>
         {isUser && <div className="p-1.5 rounded-full bg-slate-200 text-slate-600 flex-shrink-0"><UserIcon className="w-5 h-5" /></div>}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow h-[calc(100vh-100px)] flex flex-col">
      <h2 className="text-xl font-semibold text-slate-800 p-4 border-b border-slate-200">{t.chatbotTitle}</h2>
      
      <div ref={chatContainerRef} className="flex-grow p-6 space-y-6 overflow-y-auto">
        {history.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
        {isLoading && (
            <div className="flex items-start gap-3 animate-fade-in">
                 <div className="p-1.5 rounded-full bg-primary text-white shadow"><ModelIcon className="w-5 h-5" /></div>
                 <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-bl-lg p-3 shadow-sm">
                    <SpinnerIcon className="w-5 h-5 text-primary" />
                 </div>
            </div>
        )}
      </div>

      {error && <p className="p-4 text-sm text-red-600">{error}</p>}
      
      <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3 rtl:space-x-reverse">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={t.chatbotPlaceholder}
            className="flex-grow px-4 py-2.5 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-light transition-shadow duration-200"
            disabled={isLoading || !chat}
          />
          <button
            type="submit"
            disabled={isLoading || !chat || !userInput.trim()}
            className="p-3 rounded-full text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-110"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};