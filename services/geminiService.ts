
import { GoogleGenAI, Chat, Part } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are a compassionate, Socratic math tutor. Your goal is to help the user understand how to solve a problem, not to solve it for them. When you are given a math problem, identify it and provide only the very first step to begin solving it. Do not give away the next steps or the final answer. After you provide a step, wait for the user to respond. If the user asks 'Why?' or a similar question, explain the mathematical concept or rule behind the step you just suggested in a clear and simple way. Then, prompt them to try the step. Be patient, encouraging, and focus on building their understanding and confidence. Format math expressions clearly.`;

export const createTutoringSession = async (isThinkingMode: boolean): Promise<Chat> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const modelName = isThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
  const config = isThinkingMode ? { thinkingConfig: { thinkingBudget: 32768 } } : {};

  const chat = ai.chats.create({
    model: modelName,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      ...config,
    },
  });

  return chat;
};

export const streamFirstMessage = async (chat: Chat, imagePart: Part, prompt: string) => {
  return await chat.sendMessageStream({
    message: [prompt, imagePart],
  });
};

export const streamMessage = async (chat: Chat, prompt:string) => {
  return await chat.sendMessageStream({ message: prompt });
};
