import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { theme, previousWords = [] } = await req.json();

    const prompt = `
テーマ「${theme}」に関連する日本語の熟語（2文字から4文字）を1つ生成してください。
以下の条件を満たすものを生成してください：
- 一般的によく使われる熟語
- 読み方は全てひらがなで表記可能
- 漢字のみで構成される（かな文字を含まない）
${previousWords.length > 0 ? `- 以下の熟語は除外してください：${previousWords.join('、')}` : ''}

以下のJSON形式で出力してください：
{
  "word": "熟語",
  "reading": "よみかた"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "あなたは日本語の熟語を生成するアシスタントです。指定された形式で正確に出力してください。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const content = response.choices[0].message?.content;
    if (!content) {
      throw new Error('No content in response');
    }

    return new Response(content, {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Generate error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate vocab' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 