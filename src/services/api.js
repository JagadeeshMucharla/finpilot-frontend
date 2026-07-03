// src/services/api.js
// Connects FinPilot AI frontend to the real FastAPI backend

const BASE_URL = import.meta.env.VITE_API_URL || "https://finpilot-backend.onrender.com";

// ─── AUTH ─────────────────────────────────────────────────────────────────────
let _token = localStorage.getItem("finpilot_token") || null;

export const setToken = (t) => { _token = t; localStorage.setItem("finpilot_token", t); };
export const clearToken = () => { _token = null; localStorage.removeItem("finpilot_token"); };
export const getToken = () => _token;

async function req(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (_token) headers["Authorization"] = `Bearer ${_token}`;
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Network error" }));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ─── AUTH API ─────────────────────────────────────────────────────────────────
export const auth = {
  signup: (name, email, password) =>
    req("/auth/signup", { method: "POST", body: JSON.stringify({ name, email, password }) }),

  login: async (email, password) => {
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });
    if (!res.ok) throw new Error("Invalid credentials");
    const data = await res.json();
    setToken(data.access_token);
    return data;
  },

  logout: () => { clearToken(); window.location.reload(); },
};

// ─── STOCKS API ───────────────────────────────────────────────────────────────
export const stocks = {
  screener: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return req(`/stocks/screener${q ? "?" + q : ""}`);
  },
  quote: (symbol) => req(`/stocks/quote/${symbol}`),
  signal: (symbol) => req(`/stocks/signal/${symbol}`),
  allSignals: () => req("/stocks/signals/all"),
  history: (symbol, period = "6mo", interval = "1d") =>
    req(`/stocks/history/${symbol}?period=${period}&interval=${interval}`),
  research: (symbol) => req(`/stocks/research/${symbol}`),
  predict: (symbol) => req(`/stocks/predict/${symbol}`),
  allPredictions: () => req("/stocks/predict/all"),
  sectors: () => req("/stocks/sectors"),
};

// ─── PORTFOLIO API ────────────────────────────────────────────────────────────
export const portfolio = {
  get: () => req("/portfolio/"),
  add: (symbol, quantity, avg_buy_price) =>
    req("/portfolio/add", { method: "POST", body: JSON.stringify({ symbol, quantity, avg_buy_price }) }),
  remove: (id) => req(`/portfolio/${id}`, { method: "DELETE" }),
  addTrade: (data) => req("/portfolio/trade", { method: "POST", body: JSON.stringify(data) }),
  closeTrade: (id, exit_price) =>
    req(`/portfolio/trade/${id}/close`, { method: "PUT", body: JSON.stringify({ exit_price }) }),
  trades: () => req("/portfolio/trades"),
  watchlist: () => req("/portfolio/watchlist"),
  addWatchlist: (symbol) => req(`/portfolio/watchlist/${symbol}`, { method: "POST" }),
  removeWatchlist: (id) => req(`/portfolio/watchlist/${id}`, { method: "DELETE" }),
};

// ─── FINANCE API ──────────────────────────────────────────────────────────────
export const finance = {
  get: () => req("/finance/"),
  update: (data) => req("/finance/update", { method: "PUT", body: JSON.stringify(data) }),
  addGoal: (data) => req("/finance/goals", { method: "POST", body: JSON.stringify(data) }),
  updateGoal: (id, saved_amount) =>
    req(`/finance/goals/${id}/progress?saved_amount=${saved_amount}`, { method: "PUT" }),
};

// ─── NEWS API ─────────────────────────────────────────────────────────────────
export const news = {
  get: () => req("/news/"),
  forStock: (symbol) => req(`/news/${symbol}`),
};

// ─── ALERTS API ───────────────────────────────────────────────────────────────
export const alerts = {
  get: () => req("/alerts/"),
  markRead: (id) => req(`/alerts/${id}/read`, { method: "PUT" }),
  markAllRead: () => req("/alerts/read-all", { method: "PUT" }),
};

// ─── HOOKS (React) ────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from "react";

export function useApi(fn, deps = [], interval = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fn();
      setData(result);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    fetch();
    if (interval) {
      const t = setInterval(fetch, interval);
      return () => clearInterval(t);
    }
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// Convenience hooks
export const usePortfolio = () => useApi(portfolio.get, [], 60000);          // Refresh every 60s
export const useFinance = () => useApi(finance.get, [], 300000);             // Refresh every 5min
export const useNews = () => useApi(news.get, [], 900000);                   // Refresh every 15min
export const useAlerts = () => useApi(alerts.get, [], 60000);                // Refresh every 60s
export const useScreener = (params) => useApi(() => stocks.screener(params), [JSON.stringify(params)], 300000);
export const useSignal = (symbol) => useApi(() => stocks.signal(symbol), [symbol], 300000);
export const useAllSignals = () => useApi(stocks.allSignals, [], 300000);
export const useAllPredictions = () => useApi(stocks.allPredictions, [], 600000);
