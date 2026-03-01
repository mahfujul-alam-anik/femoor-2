'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api/axios';
import { endpoints } from '@/lib/api/endpoints';

export function useStats(params = {}) {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(endpoints.stats, { params });
      setData(res.data.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}
