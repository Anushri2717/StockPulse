import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useFetch = (url, deps = []) => {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url || !token) return;
    setLoading(true);
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e); setLoading(false); });
  }, [url, token, ...deps]);

  return { data, loading, error };
};

export const useApi = () => {
  const { token } = useAuth();

  const request = async (method, url, body) => {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: body ? JSON.stringify(body) : undefined
    });
    return res.json();
  };

  return {
    get:    (url)        => request('GET', url),
    post:   (url, body)  => request('POST', url, body),
    delete: (url)        => request('DELETE', url),
  };
};