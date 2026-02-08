
import { GoogleGenAI, Type } from "@google/genai";
import { AppLanguage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const LANG_NAMES: Record<AppLanguage, string> = {
  en: "English",
  id: "Indonesian",
  zh: "Chinese",
  ja: "Japanese",
  fr: "French"
};

// Helper to ensure temperature stays within the user-requested range of 28-32
const clampTemp = (temp: number) => Math.min(32, Math.max(28, temp));

export async function askWeatherAI(prompt: string, context: string, lang: AppLanguage) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-exp-1206'
      contents: `Context: ${context}\n\nUser Question: ${prompt}`,
      config: {
        systemInstruction: `You are EnvAI, a friendly and cute environmental assistant for the EnvWrist app. Respond in ${LANG_NAMES[lang]}. Use simple, encouraging language suitable for 14-year-olds and seniors. Use emojis! Always answer in the requested language. Note: For this specific app, temperatures are strictly maintained between 28°C and 32°C.`,
      },
    });
    return response.text || "Oops, my clouds are a bit foggy. Can you ask again?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to the environmental satellites right now.";
  }
}

export async function getRealtimeWeather(lat: number, lon: number, lang: AppLanguage) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-exp-1206'
      contents: `Find the current real-time weather and city name for coordinates: latitude ${lat}, longitude ${lon}. 
      Provide: City Name, Temperature in Celsius (STRICTLY between 28 and 32), Condition (choose ONLY from: Sunny, Cloudy, Rainy, Thunder), Pressure (hPa), Altitude (meters), Humidity (%), VOC (ppm, 0.0-0.5), and Air Status (Good, Moderate, Bad).
      Include a "description" field which is a short 1-sentence advice or status update in ${LANG_NAMES[lang]}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            location: { type: Type.STRING },
            temp: { type: Type.NUMBER },
            condition: { type: Type.STRING },
            pressure: { type: Type.NUMBER },
            altitude: { type: Type.NUMBER },
            humidity: { type: Type.NUMBER },
            voc: { type: Type.NUMBER },
            airStatus: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ["location", "temp", "condition", "pressure", "altitude", "humidity", "voc", "airStatus", "description"]
        }
      },
    });
    
    const data = JSON.parse(response.text);
    if (!['Sunny', 'Cloudy', 'Rainy', 'Thunder'].includes(data.condition)) {
      data.condition = 'Cloudy'; 
    }
    // Enforce temperature range
    data.temp = clampTemp(data.temp);
    return data;
  } catch (error) {
    console.error("Failed to fetch real-time weather:", error);
    return null;
  }
}

export async function getHourlyForecast(location: string, lang: AppLanguage) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-exp-1206'
      contents: `Provide an hourly weather forecast for the next 8 hours for ${location}. Include Time (e.g., 2 PM), Temp (STRICTLY between 28 and 32), and Condition (Sunny, Cloudy, Rainy, or Thunder). Translate the time format suitable for ${LANG_NAMES[lang]}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              time: { type: Type.STRING },
              temp: { type: Type.NUMBER },
              condition: { type: Type.STRING }
            },
            required: ["time", "temp", "condition"]
          }
        }
      },
    });
    const data = JSON.parse(response.text);
    return data.map((item: any) => ({ ...item, temp: clampTemp(item.temp) }));
  } catch (error) {
    console.error("Hourly Forecast Error:", error);
    return [];
  }
}

export async function get20DayForecast(location: string, lang: AppLanguage) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-exp-1206'
      contents: `Provide a 20-day weather forecast for ${location}. For each day, provide the Day Name, Estimated Temperature (STRICTLY between 28 and 32), and Condition (Sunny, Cloudy, Rainy, or Thunder). Translate day names to ${LANG_NAMES[lang]}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              dayName: { type: Type.STRING },
              temp: { type: Type.NUMBER },
              condition: { type: Type.STRING }
            },
            required: ["dayName", "temp", "condition"]
          }
        }
      },
    });
    const data = JSON.parse(response.text);
    return data.map((item: any) => ({ ...item, temp: clampTemp(item.temp) }));
  } catch (error) {
    console.error("Forecast Error:", error);
    return [];
  }
}
