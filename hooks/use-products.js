'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api/axios';
import { endpoints } from '@/lib/api/endpoints';

export function useProducts(params = {}) {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(endpoints.products, { params });
      setData(res.data.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const create = async (payload) => {
    const res = await api.post(endpoints.products, payload);
    await refetch();
    return res.data.data;
  };

  const update = async (id, payload) => {
    const res = await api.patch(endpoints.productById(id), payload);
    await refetch();
    return res.data.data;
  };

  const remove = async (id) => {
    await api.delete(endpoints.productById(id));
    await refetch();
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch, create, update, remove };
}
