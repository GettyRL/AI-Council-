import { GoogleGenAI } from "@google/genai";
import { Message, AgentRole, AgentConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAgentResponse = async (
  agentConfig: AgentConfig,
  history: Message[],
  allAgentsConfig: Record<string, AgentConfig>
): Promise<{ text: string; confidence: number }> => {
  
  // Format history
  const conversationContext = history.map(msg => {
    let roleName = "User";
    if (msg.role !== AgentRole.USER) {
        // Look up the name from the passed config to ensure we use the Template Persona name
        const roleKey = msg.role as Exclude<AgentRole, AgentRole.USER>;
        roleName = allAgentsConfig[roleKey]?.name || msg.role;
    }
    return `[${roleName}]: ${msg.content}`;
  }).join('\n\n');

  const prompt = `
    You are participating in a continuous council meeting.
    
    Your Identity:
    Name: ${agentConfig.name}
    Role: ${agentConfig.title}
    
    SYSTEM INSTRUCTIONS:
    ${agentConfig.systemInstruction}

    CRITICAL OUTPUT FORMAT:
    1. Provide your response in valid Markdown.
    2. At the very end of your response, on a new line, you MUST include a confidence score (0-100) regarding your recommendation or the project's success probability, in this format:
    
    [[CONFIDENCE: 85]]

    Meeting Transcript:
    ---
    ${conversationContext}
    ---
    
    Based on the transcript above, provide your specific contribution. Stay strictly within your persona.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7, 
      }
    });

    const fullText = response.text || "I have nothing to add.";
    
    // Extract confidence
    let confidence = 80; // Default
    let cleanText = fullText;

    const confidenceMatch = fullText.match(/\[\[CONFIDENCE:\s*(\d+)\]\]/);
    if (confidenceMatch) {
        confidence = parseInt(confidenceMatch[1], 10);
        cleanText = fullText.replace(confidenceMatch[0], '').trim();
    }

    return { text: cleanText, confidence };
  } catch (error) {
    console.error(`Error generating response for ${agentConfig.name}:`, error);
    return { text: `[System Error] Could not generate a response.`, confidence: 0 };
  }
};