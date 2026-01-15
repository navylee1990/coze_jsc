import { useState, useEffect, useRef } from 'react';

interface AIInsightResult {
  content: string;
  isLoading: boolean;
  error: string | null;
  regenerate: () => void;
}

export function useAIInsight(chartType: string, data: any): AIInsightResult {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateInsight = async () => {
    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setContent('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-insight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chartType, data }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('生成结论失败');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('无法读取响应流');
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);

            if (dataStr === '[DONE]') {
              continue;
            }

            try {
              const json = JSON.parse(dataStr);
              if (json.content) {
                setContent((prev) => prev + json.content);
              }
            } catch (e) {
              console.error('解析响应失败:', e);
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
        console.error('生成AI结论失败:', err);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  useEffect(() => {
    generateInsight();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [chartType, data]);

  return {
    content,
    isLoading,
    error,
    regenerate: generateInsight,
  };
}
