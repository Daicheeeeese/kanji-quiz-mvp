'use client';
import { useState, useEffect, useRef } from 'react';
import * as wanakana from 'wanakana';

interface VocabData {
  word: string;
  reading: string;
  meaning: {
    ja: string;
    fr: string;
  };
  example: {
    ja: string;
    fr: string;
  };
  level?: number;
}

// テーマカラー定義
const themeColors = {
  primary: '#2563eb',    // メインカラー（濃いブルー）
  secondary: '#60a5fa',  // アクセントカラー（明るいブルー）
  success: '#22c55e',    // 正解時（グリーン）
  error: '#ef4444',      // 不正解時（レッド）
  background: '#f8fafc', // 背景色（薄いグレー）
  text: {
    primary: '#1e293b',  // メインテキスト（濃いグレー）
    secondary: '#64748b' // サブテキスト（薄いグレー）
  }
}

export default function Home() {
  const [input, setInput] = useState('');
  const [theme, setTheme] = useState('');
  const [currentVocab, setCurrentVocab] = useState<VocabData | null>(null);
  const [nextVocab, setNextVocab] = useState<VocabData | null>(null);
  const [result, setResult] = useState<{ correct: boolean; userInput: string; expected: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isThemeSet, setIsThemeSet] = useState(false);
  const [pastVocabs, setPastVocabs] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const wanakanaRef = useRef(false);
  const [isRomaji, setIsRomaji] = useState(false);
  const lastInputRef = useRef(''); // 最後の入力を保持するref
  const [showImeHelp, setShowImeHelp] = useState(false);

  const buttonBaseStyle = "w-full px-4 py-3 sm:py-4 rounded-lg text-white font-medium tracking-wide transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-md text-base sm:text-lg";

  // wanakanaの初期化とクリーンアップを改善
  useEffect(() => {
    let mounted = true;

    const initWanakana = () => {
      if (!mounted) return;
      
      if (inputRef.current && !wanakanaRef.current) {
        try {
          setTimeout(() => {
            if (!mounted || !inputRef.current) return;
            
            wanakana.bind(inputRef.current, {
              defaultKanaType: 'hiragana',
              convertSpaces: false
            });
            wanakanaRef.current = true;
            console.log('Wanakana initialized successfully');
          }, 100);
        } catch (error) {
          console.error('Wanakana initialization error:', error);
        }
      }
    };

    initWanakana();

    // クリーンアップ処理を改善
    return () => {
      mounted = false;
      try {
        const element = inputRef.current;
        if (element && wanakanaRef.current) {
          // 直接DOMイベントリスナーを削除
          const events = element.getEventListeners?.() || [];
          events.forEach(event => {
            element.removeEventListener(event.type, event.listener);
          });
          wanakanaRef.current = false;
        }
      } catch (error) {
        // エラーを抑制
        console.log('Cleanup completed');
      }
    };
  }, [isThemeSet]);

  // IMEの状態を検知
  const handleCompositionStart = () => {
    setIsRomaji(false);
  };

  const handleCompositionEnd = () => {
    setIsRomaji(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (/^[a-zA-Z0-9]$/.test(e.key)) {
      setIsRomaji(true);
    }
  };

  // 入力ハンドラー
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isRomaji) {
      const normalizedValue = value.toLowerCase();
      setInput(normalizedValue);
      lastInputRef.current = normalizedValue; // 最後の入力を保存
    } else {
      setInput(value);
      lastInputRef.current = value;
    }
  };

  const generateNewVocab = async (theme: string): Promise<VocabData | null> => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Generate vocab error:', error);
      // エラー時の再試行ロジック
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1秒待機
      try {
        return await generateNewVocab(theme); // 再試行
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        return null;
      }
    }
  };

  const prepareNextVocab = async () => {
    try {
      if (!theme) return;
      
      setLoading(true);
      const newVocab = await generateNewVocab(theme);
      
      if (newVocab) {
        setNextVocab(newVocab);
      } else {
        console.error('Failed to generate next vocab');
        // エラーメッセージをユーザーに表示
        alert('問題の生成に失敗しました。もう一度お試しください。');
      }
    } catch (error) {
      console.error('Prepare next vocab error:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeVocabs = async () => {
    setLoading(true);
    try {
      const currentData = await generateNewVocab(theme);
      if (!currentData) {
        throw new Error('Failed to generate initial vocab');
      }

      setCurrentVocab(currentData);
      setIsThemeSet(true);
      
      prepareNextVocab().catch(console.error);
      
    } catch (error) {
      console.error('Initialize error:', error);
      alert('熟語の生成に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  };

  const handleThemeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme.trim() || loading) return;
    initializeVocabs();
  };

  const handleNext = () => {
    if (nextVocab) {
      setCurrentVocab(nextVocab);
      setNextVocab(null);
      setInput('');
      setResult(null);
      lastInputRef.current = ''; // refをリセット
      prepareNextVocab();
    }
  };

  // 回答チェック時の変換処理を改善
  const checkAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVocab) return;

    if (result) {
      handleNext();
      return;
    }

    let hiraganaInput;
    if (isRomaji) {
      // 最後の入力を使用して変換
      const valueToConvert = lastInputRef.current;
      try {
        // 変換オプションを追加
        hiraganaInput = wanakana.toHiragana(valueToConvert, {
          IMEMode: false,
          useObsoleteKana: false,
          passRomaji: false
        });
      } catch (error) {
        console.error('Conversion error:', error);
        hiraganaInput = valueToConvert;
      }
    } else {
      hiraganaInput = input;
    }

    const isCorrect = hiraganaInput === currentVocab.reading;
    
    setResult({ 
      correct: isCorrect,
      userInput: hiraganaInput,
      expected: currentVocab.reading
    });

    if (!nextVocab) {
      prepareNextVocab();
    }
  };

  // エンターキーのイベントハンドラー
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (result && event.key === 'Enter') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [result]);

  useEffect(() => {
    if (currentVocab && isThemeSet && !loading) {　　　　
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [currentVocab, isThemeSet, loading]);

  if (!isThemeSet) {
    return (
      <div 
        className="min-h-screen p-4 sm:p-6 md:p-8 flex items-center justify-center" 
        style={{ backgroundColor: themeColors.background }}
      >
        <main className="w-full max-w-2xl mx-auto">
          <div className="max-w-md mx-auto w-full">
            <div className="space-y-8 animate-fade-in">
              <h1 
                className="text-3xl sm:text-4xl font-bold text-center tracking-tight"
                style={{ color: themeColors.text.primary }}
              >
                熟語学習
              </h1>
              <form onSubmit={handleThemeSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-xl shadow-lg transition-all hover:shadow-xl">
                <div>
                  <label 
                    htmlFor="theme" 
                    className="block text-lg sm:text-xl mb-3 font-medium tracking-tight" 
                    style={{ color: themeColors.text.primary }}
                  >
                    どんな熟語を学習したいですか？
                  </label>
                  <input
                    id="theme"
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full p-3 sm:p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all text-base sm:text-lg"
                    style={{ 
                      borderColor: themeColors.secondary,
                      focusRing: themeColors.primary 
                    }}
                    autoFocus
                    disabled={loading}
                  />
                </div>
                <div 
                  className="text-sm sm:text-base space-y-2 tracking-wide" 
                  style={{ color: themeColors.text.secondary }}
                >
                  <p className="font-medium">【入力例】</p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>仕事で使う熟語</li>
                    <li>日常生活の熟語</li>
                    <li>ビジネスで頻出の熟語</li>
                    <li>感情を表す熟語</li>
                    <li>前向きな意味の熟語</li>
                  </ul>
                </div>
                <button
                  type="submit"
                  disabled={!theme.trim() || loading}
                  className={`${buttonBaseStyle} ${!theme.trim() || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
                  style={{ 
                    backgroundColor: themeColors.primary,
                  }}
                >
                  <span className="relative inline-flex items-center">
                    {loading ? (
                      <>
                        <span className="animate-pulse">生成中</span>
                        <span className="ml-2">...</span>
                      </>
                    ) : (
                      '開始'
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-4 sm:p-6 md:p-8 flex items-center justify-center" 
      style={{ backgroundColor: themeColors.background }}
    >
      <main className="w-full max-w-2xl mx-auto">
        <div className="max-w-md mx-auto w-full">
          <div className="space-y-6">
            {currentVocab && (
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg transition-all animate-slide-up">
                <div className="text-5xl sm:text-6xl md:text-7xl mb-8 font-bold tracking-tight animate-fade-in text-center" style={{ color: themeColors.text.primary }}>
                  {currentVocab.word}
                </div>
                <form onSubmit={checkAnswer} className="space-y-4">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInput}
                    onCompositionStart={handleCompositionStart}
                    onCompositionEnd={handleCompositionEnd}
                    onKeyDown={handleKeyDown}
                    placeholder="読み方を入力"
                    className="w-full p-3 sm:p-4 border rounded-lg focus:outline-none focus:ring-2 transition-all text-base sm:text-lg"
                    style={{ 
                      borderColor: themeColors.secondary,
                      focusRing: themeColors.primary
                    }}
                    disabled={loading || result !== null}
                    spellCheck="false"
                    autoComplete="off"
                  />
                  <div className="space-y-2">
                    <button
                      type="submit"
                      disabled={loading || (!result && !input)}
                      className={`${buttonBaseStyle} ${loading || (!result && !input) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
                      style={{ 
                        backgroundColor: result ? themeColors.success : themeColors.primary,
                      }}
                    >
                      {result ? '次へ' : '回答を確認'}
                    </button>
                    {result && (
                      <p 
                        className="text-sm sm:text-base text-center animate-fade-in"
                        style={{ color: themeColors.text.secondary }}
                      >
                        ※Enterキーを押すと次の問題に進みます
                      </p>
                    )}
                  </div>
                </form>
              </div>
            )}

            {result && (
              <div 
                className="p-6 rounded-lg animate-slide-up"
                style={{ 
                  backgroundColor: result.correct ? `${themeColors.success}15` : `${themeColors.error}15`
                }}
              >
                <p 
                  className="text-center font-bold text-lg tracking-tight mb-4"
                  style={{ 
                    color: result.correct ? themeColors.success : themeColors.error 
                  }}
                >
                  {result.correct ? '正解！' : '不正解...'}
                </p>
                {!result.correct && (
                  <div className="text-center space-y-2">
                    <p style={{ color: themeColors.text.secondary }}>
                      あなたの回答: {result.userInput}
                    </p>
                    <p style={{ color: themeColors.text.secondary }}>
                      正しい読み方: {result.expected}
                    </p>
                  </div>
                )}
                {currentVocab && (
                  <div className="mt-4 p-4 bg-white rounded shadow">
                    <div className="mb-4">
                      <p className="text-lg font-semibold mb-2">意味 / Sens:</p>
                      <p className="text-gray-700 mb-1">🇯🇵 {currentVocab.meaning.ja}</p>
                      <p className="text-gray-700 italic">🇫🇷 {currentVocab.meaning.fr}</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold mb-2">例文 / Exemple:</p>
                      <p className="text-gray-700 mb-1">🇯🇵 {currentVocab.example.ja}</p>
                      <p className="text-gray-700 italic">🇫🇷 {currentVocab.example.fr}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 