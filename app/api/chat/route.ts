import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const body = await req.json();
    const { mode, kanji, userAnswer } = body;

    if (mode === 'generate') {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '小学校で習う漢字とその読み方（ひらがな）をランダムに1つ提示してください。形式は以下のJSONで返してください: {"kanji": "漢字", "reading": "よみかた"}'
          },
          {
            role: 'user',
            content: '漢字とその読み方を教えてください'
          }
        ],
        temperature: 0.7,
      });

      return NextResponse.json(JSON.parse(response.choices[0].message.content || '{}'));
    } 
    
    if (mode === 'check') {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '提示された漢字の読み方と、ユーザーの回答が合っているか判定してください。形式は以下のJSONで返してください: {"correct": true/false, "correctReading": "正しい読み方"}'
          },
          {
            role: 'user',
            content: `漢字「${kanji}」に対してユーザーが「${userAnswer}」と回答しました。正しいですか？`
          }
        ],
        temperature: 0.7,
      });

      return NextResponse.json(JSON.parse(response.choices[0].message.content || '{}'));
    }

    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 