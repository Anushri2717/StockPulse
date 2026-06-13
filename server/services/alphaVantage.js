const axios = require('axios');
const KEY = process.env.ALPHA_VANTAGE_KEY;
const BASE = 'https://www.alphavantage.co/query';

const cache = new Map();
const TTL = 60 * 1000;

const cached = async (key, fn) => {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.time < TTL) return hit.data;
  const data = await fn();
  cache.set(key, { data, time: Date.now() });
  return data;
};

const getQuote = (symbol) => cached(`q_${symbol}`, async () => {
  const { data } = await axios.get(BASE, {
    params: { function: 'GLOBAL_QUOTE', symbol, apikey: KEY }
  });
  const q = data['Global Quote'];
  if (!q || !q['05. price']) return null;
  return {
    symbol: q['01. symbol'],
    price: parseFloat(q['05. price']),
    change: parseFloat(q['09. change']),
    changePercent: q['10. change percent'],
    volume: parseInt(q['06. volume']),
    high: parseFloat(q['03. high']),
    low: parseFloat(q['04. low']),
    open: parseFloat(q['02. open']),
  };
});

const getHistory = (symbol) => cached(`h_${symbol}`, async () => {
  const { data } = await axios.get(BASE, {
    params: { function: 'TIME_SERIES_DAILY', symbol, outputsize: 'compact', apikey: KEY }
  });
  const series = data['Time Series (Daily)'];
  if (!series) return [];
  return Object.entries(series).slice(0, 30).map(([date, v]) => ({
    date,
    open: parseFloat(v['1. open']),
    high: parseFloat(v['2. high']),
    low: parseFloat(v['3. low']),
    close: parseFloat(v['4. close']),
    volume: parseInt(v['5. volume']),
  })).reverse();
});

const searchSymbol = async (keywords) => {
  const { data } = await axios.get(BASE, {
    params: { function: 'SYMBOL_SEARCH', keywords, apikey: KEY }
  });
  return (data.bestMatches || []).slice(0, 6).map(m => ({
    symbol: m['1. symbol'],
    name: m['2. name'],
    type: m['3. type'],
    region: m['4. region'],
  }));
};

module.exports = { getQuote, getHistory, searchSymbol };