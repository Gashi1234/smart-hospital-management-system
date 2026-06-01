import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Server is running");
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/analyze-symptoms", async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms) {
      return res.status(400).json({ error: "Symptoms are required." });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
      You are a hospital AI assistant.
      
      Analyze patient symptoms and return ONLY valid JSON.
      
      Return this exact format:
        {
        "department": "Department name",
        "urgency": "Low/Medium/High",
        "recommendation": "Short recommendation",
        "reason": "Short medical explanation",
        "quickCareTip": "One short practical care tip the patient can do now"
        }
      
      Possible departments:
      - Cardiology
      - Neurology
      - General Medicine
      - Orthopedics
      - Pulmonology
      
      Do not return markdown.
      Do not return explanations outside JSON.
      `,
        },
        {
          role: "user",
          content: symptoms,
        },
      ],
    });

    const aiResponse = JSON.parse(
        completion.choices[0].message.content
      );
      
      res.json(aiResponse);
  } catch (error) {
    console.log("OpenAI error:", error);

    res.status(500).json({
      error: "AI analysis failed.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`AI Server running on http://localhost:${PORT}`);
});