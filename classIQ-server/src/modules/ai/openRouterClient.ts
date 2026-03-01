import axios from "axios";

export const callOpenRouter = async (messages: any[]) => {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: process.env.OPENROUTER_MODEL,
      messages,
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content;
};