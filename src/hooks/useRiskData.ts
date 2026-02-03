/**
 * 风险识别数据Hook
 * 从API获取风险识别数据
 */

import { useState, useEffect } from 'react';

export interface RiskDataItem {
  [key: string]: any;
}

export function useRiskData(type: string) {
  const [data, setData] = useState<RiskDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/risks?type=${type}`);
        const result = await response.json();

        if (result.success) {
          setData(result.data || []);
        } else {
          console.error('获取数据失败:', result.error);
          setError(result.error);
        }
      } catch (err) {
        console.error('请求失败:', err);
        setError('网络错误');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [type]);

  return { data, loading, error };
}

/**
 * 驾驶舱汇总数据Hook
 */
export function useDashboardSummary() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard/summary');
        const result = await response.json();

        if (result.success) {
          setSummary(result.data);
        } else {
          console.error('获取汇总数据失败:', result.error);
          setError(result.error);
        }
      } catch (err) {
        console.error('请求失败:', err);
        setError('网络错误');
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, []);

  return { summary, loading, error };
}
