import { useState } from 'react';
import { QuizItem } from '../types/quiz';
import { quizData } from '../data/quizData';

export default function KanjiQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState<QuizItem>(getRandomQuestion());
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function getRandomQuestion(): QuizItem {
    const randomIndex = Math.floor(Math.random() * quizData.length);
    return quizData[randomIndex];
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const isCorrect = userAnswer === currentQuestion.reading;
    setResult(isCorrect ? 'correct' : 'incorrect');
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/getExplanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kanji: currentQuestion.kanji,
          reading: currentQuestion.reading,
          isCorrect
        }),
      });
      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      console.error('Error fetching explanation:', error);
    }
    setIsLoading(false);
  }

  function handleNext() {
    setCurrentQuestion(getRandomQuestion());
    setUserAnswer('');
    setResult(null);
    setExplanation('');
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">ビジネス漢字クイズ</h1>
      
      <div className="mb-8">
        <h2 className="text-xl mb-4">問題：{currentQuestion.kanji}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="ひらがなで入力してください"
            className="w-full p-2 border rounded mb-4"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={isLoading}
          >
            回答する
          </button>
        </form>
      </div>

      {result && (
        <div className="mb-6">
          <p className={`text-lg font-bold ${
            result === 'correct' ? 'text-green-600' : 'text-red-600'
          }`}>
            {result === 'correct' ? '正解！' : '不正解...'}
          </p>
          {isLoading ? (
            <p>解説を生成中...</p>
          ) : (
            <div className="mt-4">
              <p className="font-bold">解説：</p>
              <p>{explanation}</p>
            </div>
          )}
          <button
            onClick={handleNext}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
          >
            次の問題へ
          </button>
        </div>
      )}
    </div>
  );
} 