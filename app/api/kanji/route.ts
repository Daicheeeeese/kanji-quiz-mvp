import { NextResponse } from 'next/server';
import { vocabData } from '../../data/vocab';

export async function GET() {
  try {
    // ランダムに1つの熟語を選択
    const randomVocab = vocabData[Math.floor(Math.random() * vocabData.length)];

    return NextResponse.json({
      word: randomVocab.word,
      reading: randomVocab.reading,
      meaning: {
        ja: randomVocab.meaning.ja,
        fr: randomVocab.meaning.fr
      },
      example: {
        ja: randomVocab.example.ja,
        fr: randomVocab.example.fr
      },
      level: randomVocab.level
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
} 