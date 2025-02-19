import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { kanji, reading, isCorrect } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "あなたは日本語の漢字とビジネス用語の専門家です。"
        },
        {
          role: "user",
          content: `漢字「${kanji}」の読み方は「${reading}」です。
          ユーザーの回答は${isCorrect ? '正解' : '不正解'}でした。
          この漢字の意味や使い方について、簡潔に解説してください。`
        }
      ],
    });

    const explanation = completion.choices[0].message.content;
    res.status(200).json({ explanation });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error generating explanation' });
  }
} 