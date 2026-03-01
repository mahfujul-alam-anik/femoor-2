'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api/axios';
import { endpoints } from '@/lib/api/endpoints';

export function useOrders(params = {}) {
  const [data, setData] = useState({ data: [], meta: { page: 1, pageSize: 8, total: 0 } });
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(endpoints.orders, { params });
      setData(res.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const create = async (payload) => {
    const res = await api.post(endpoints.orders, payload);
    await refetch();
    return res.data.data;
  };

  const update = async (orderId, payload) => {
    const res = await api.patch(endpoints.orderById(orderId), payload);
    await refetch();
    return res.data.data;
  };

  const pushToSteadfast = async (orderId) => {
    const res = await api.post(endpoints.pushToSteadfast(orderId));
    await refetch();
    return res.data.data;
  };

  const syncStatus = async (orderId) => {
    const res = await api.post(endpoints.syncStatus(orderId));
    await refetch();
    return res.data.data;
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch, create, update, pushToSteadfast, syncStatus };
}

export function useOrder(orderId) {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(endpoints.orderById(orderId));
      setData(res.data.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const update = async (payload) => {
    const res = await api.patch(endpoints.orderById(orderId), payload);
    await refetch();
    return res.data.data;
  };

  const pushToSteadfast = async () => {
    const res = await api.post(endpoints.pushToSteadfast(orderId));
    await refetch();
    return res.data.data;
  };

  const syncStatus = async () => {
    const res = await api.post(endpoints.syncStatus(orderId));
    await refetch();
    return res.data.data;
  };

  useEffect(() => {
    if (orderId) refetch();
  }, [orderId, refetch]);

  return { data, isLoading, error, refetch, update, pushToSteadfast, syncStatus };
}
