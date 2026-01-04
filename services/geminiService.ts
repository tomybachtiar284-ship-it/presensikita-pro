
import { GoogleGenAI } from "@google/genai";
import { AttendanceRecord } from "../types";

// Fix: Always use the named parameter for API key and assume it is available in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAttendanceInsights = async (records: AttendanceRecord[]) => {
  // Fix: Removed explicit check for process.env.API_KEY as per guidelines (assume pre-configured)
  try {
    const dataStr = JSON.stringify(records.map(r => ({
      status: r.status,
      late: r.lateMinutes,
      date: r.date
    })));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analisis data presensi berikut dan berikan ringkasan performa tim dalam 3 kalimat singkat bahasa Indonesia: ${dataStr}`,
      config: {
        systemInstruction: "Anda adalah asisten HR profesional. Fokus pada tingkat keterlambatan dan kepatuhan waktu.",
      }
    });

    // Fix: Access .text property directly (not a method)
    return response.text || "Gagal mendapatkan analisis AI.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error saat menghubungi asisten AI.";
  }
};
