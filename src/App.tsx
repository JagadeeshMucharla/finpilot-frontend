// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from "react";

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const C = {
  bg: "#080E1A", card: "#0D1528", card2: "#111D35",
  border: "#1A2844", borderLit: "#00D4FF20",
  cyan: "#00D4FF", cyanDim: "#00D4FF18", cyanMid: "#00D4FF33",
  green: "#00E57A", greenDim: "#00E57A18",
  red: "#FF3D5A", redDim: "#FF3D5A18",
  amber: "#FFB800", amberDim: "#FFB80018",
  purple: "#A855F7", purpleDim: "#A855F718",
  text: "#E4EAF4", muted: "#5A6E8A", dim: "#1E2E46",
};

// ─── RESPONSIVE HOOK ──────────────────────────────────────────────────────────
function useResponsive() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { isMobile: w < 768, isTablet: w >= 768 && w < 1100, isDesktop: w >= 1100, w };
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const TICKERS = [
  { sym: "NIFTY 50", price: "24,198", chg: "+1.24%", up: true },
  { sym: "SENSEX", price: "79,943", chg: "+1.18%", up: true },
  { sym: "RELIANCE", price: "2,987", chg: "+2.34%", up: true },
  { sym: "TCS", price: "4,201", chg: "-0.87%", up: false },
  { sym: "INFY", price: "1,842", chg: "+1.56%", up: true },
  { sym: "HDFC BANK", price: "1,723", chg: "+0.92%", up: true },
  { sym: "WIPRO", price: "567", chg: "-1.23%", up: false },
  { sym: "BAJAJ FIN", price: "7,234", chg: "+3.14%", up: true },
  { sym: "GOLD", price: "₹72,450", chg: "+0.45%", up: true },
  { sym: "BTC/USD", price: "$67,234", chg: "+4.23%", up: true },
  { sym: "USD/INR", price: "83.42", chg: "+0.12%", up: false },
];

const PORTFOLIO = [
  { sym: "RELIANCE", qty: 25, avg: 2750, ltp: 2987.6, chg: 2.34, sector: "Energy" },
  { sym: "TCS", qty: 10, avg: 4100, ltp: 4201.15, chg: -0.87, sector: "IT" },
  { sym: "HDFC BANK", qty: 50, avg: 1680, ltp: 1723.45, chg: 0.92, sector: "Finance" },
  { sym: "INFY", qty: 30, avg: 1790, ltp: 1842.3, chg: 1.56, sector: "IT" },
  { sym: "BAJAJ FIN", qty: 8, avg: 6900, ltp: 7234.5, chg: 3.14, sector: "Finance" },
  { sym: "WIPRO", qty: 60, avg: 590, ltp: 567.8, chg: -1.23, sector: "IT" },
];

const AI_SIGNALS = [
  { sym: "RELIANCE", type: "BUY", conf: 87, profit: 73, entry: 2980, target: 3180, sl: 2890, risk: "LOW", ret: "+6.7%", tf: "5–10 Days", pattern: "Bull Flag" },
  { sym: "BAJAJ FIN", type: "BUY", conf: 79, profit: 68, entry: 7200, target: 7850, sl: 6980, risk: "MED", ret: "+9.0%", tf: "7–15 Days", pattern: "Cup & Handle" },
  { sym: "WIPRO", type: "SELL", conf: 72, profit: 61, entry: 570, target: 520, sl: 595, risk: "HIGH", ret: "+8.8%", tf: "3–7 Days", pattern: "Head & Shoulders" },
  { sym: "INFY", type: "BUY", conf: 65, profit: 58, entry: 1840, target: 2050, sl: 1780, risk: "MED", ret: "+11.4%", tf: "10–20 Days", pattern: "Ascending Triangle" },
];

const NEWS = [
  { title: "RBI holds repo rate at 6.5%, maintains cautious inflation outlook", src: "Economic Times", time: "2h", sent: "NEUTRAL", score: 0.12, stocks: ["HDFCBANK", "ICICIBANK"] },
  { title: "Reliance Jio hits 500 million subscriber milestone ahead of schedule", src: "Mint", time: "4h", sent: "POSITIVE", score: 0.84, stocks: ["RELIANCE"] },
  { title: "IT sector faces headwinds as US tech spending slows in Q2 2025", src: "Bloomberg", time: "6h", sent: "NEGATIVE", score: -0.67, stocks: ["TCS", "INFY", "WIPRO"] },
  { title: "Bajaj Finance Q1 net profit up 14% YoY, asset quality improves significantly", src: "CNBC TV18", time: "8h", sent: "POSITIVE", score: 0.91, stocks: ["BAJAJFIN"] },
  { title: "SEBI introduces new F&O margin rules effective September 2025", src: "Business Standard", time: "10h", sent: "NEUTRAL", score: -0.08, stocks: ["NSE"] },
];

const SECTORS = [
  { name: "Financial Services", chg: 1.34, stocks: 89 },
  { name: "Energy", chg: 2.11, stocks: 31 },
  { name: "Automobile", chg: 1.89, stocks: 35 },
  { name: "Healthcare", chg: 0.67, stocks: 58 },
  { name: "Consumer Goods", chg: -0.34, stocks: 74 },
  { name: "Information Technology", chg: -0.82, stocks: 42 },
];

const GOALS = [
  { name: "Home Down Payment", target: 1500000, saved: 420000, deadline: "Dec 2026", icon: "🏠" },
  { name: "Car Purchase", target: 800000, saved: 320000, deadline: "Mar 2026", icon: "🚗" },
  { name: "Vacation Fund", target: 200000, saved: 178000, deadline: "Aug 2025", icon: "✈️" },
  { name: "Emergency Fund", target: 255000, saved: 150000, deadline: "Ongoing", icon: "🛡️" },
];

const BUDGET = [
  { cat: "Housing & Rent", budget: 18000, spent: 18000, color: C.cyan },
  { cat: "Food & Groceries", budget: 12000, spent: 9400, color: C.green },
  { cat: "Transport", budget: 5000, spent: 6200, color: C.red },
  { cat: "Entertainment", budget: 4000, spent: 2800, color: C.purple },
  { cat: "Healthcare", budget: 3000, spent: 1200, color: C.amber },
  { cat: "Investments (SIP)", budget: 15000, spent: 15000, color: C.green },
];

const TRADE_HISTORY = [
  { sym: "HDFC BANK", type: "BUY", qty: 20, entry: 1680, exit: 1723, date: "12 Jun", pnl: 860, pnlPct: 2.56, status: "CLOSED" },
  { sym: "TCS", type: "SELL", qty: 5, entry: 4320, exit: 4201, date: "10 Jun", pnl: 595, pnlPct: 2.76, status: "CLOSED" },
  { sym: "RELIANCE", type: "BUY", qty: 15, entry: 2950, exit: null, date: "08 Jun", pnl: 565, pnlPct: 1.25, status: "OPEN" },
  { sym: "INFY", type: "BUY", qty: 25, entry: 1820, exit: 1760, date: "05 Jun", pnl: -1500, pnlPct: -3.3, status: "CLOSED" },
  { sym: "BAJAJ FIN", type: "BUY", qty: 4, entry: 6980, exit: 7234, date: "01 Jun", pnl: 1016, pnlPct: 3.64, status: "CLOSED" },
  { sym: "WIPRO", type: "SELL", qty: 30, entry: 595, exit: 568, date: "28 May", pnl: 810, pnlPct: 4.54, status: "CLOSED" },
];

const ALERTS_DATA = [
  { type: "AI", sym: "RELIANCE", msg: "Profit probability rose to 73% — entry zone active", time: "09:32", sev: "HIGH", read: false },
  { type: "PRICE", sym: "BAJAJ FIN", msg: "Crossed ₹7,200 resistance — watch for breakout", time: "10:15", sev: "MED", read: false },
  { type: "NEWS", sym: "TCS", msg: "3 major sources flagged negative sentiment spike", time: "11:00", sev: "HIGH", read: false },
  { type: "TRADE", sym: "WIPRO", msg: "Stop-loss at ₹595 hit — position closed", time: "11:42", sev: "HIGH", read: true },
  { type: "GOAL", sym: "VACATION", msg: "Vacation Fund is 89% funded — on track for Aug 2025", time: "08:00", sev: "LOW", read: true },
  { type: "RISK", sym: "PORTFOLIO", msg: "Portfolio drawdown exceeded 5% threshold today", time: "12:30", sev: "HIGH", read: true },
];

const INDICATORS = [
  { name: "RSI (14)", value: "64.2", signal: "Neutral", color: C.amber },
  { name: "MACD", value: "+12.4", signal: "Bullish", color: C.green },
  { name: "Stochastic", value: "72.1", signal: "Overbought", color: C.red },
  { name: "SMA 20", value: "₹2,941", signal: "Above ✓", color: C.green },
  { name: "EMA 50", value: "₹2,867", signal: "Above ✓", color: C.green },
  { name: "Bollinger", value: "3.8%", signal: "Normal", color: C.muted },
  { name: "Volume", value: "42.8L", signal: "+12% avg", color: C.cyan },
  { name: "ATR (14)", value: "₹52.8", signal: "Moderate", color: C.amber },
];

// ─── NEW FEATURE DATA ─────────────────────────────────────────────────────────
const SCREENER = [
  { sym: "RELIANCE", sector: "Energy", price: 2987.6, chg: 2.34, profit: 73, risk: "LOW", sentiment: "POSITIVE", rec: "BUY", lastAnalysis: "2m ago", suggested: 25000, expRet: "+6.7%", conf: 87 },
  { sym: "TCS", sector: "IT", price: 4201.15, chg: -0.87, profit: 41, risk: "MED", sentiment: "NEGATIVE", rec: "HOLD", lastAnalysis: "5m ago", suggested: 0, expRet: "+1.2%", conf: 52 },
  { sym: "INFY", sector: "IT", price: 1842.3, chg: 1.56, profit: 58, risk: "MED", sentiment: "NEUTRAL", rec: "BUY", lastAnalysis: "3m ago", suggested: 18000, expRet: "+11.4%", conf: 65 },
  { sym: "HDFC BANK", sector: "Finance", price: 1723.45, chg: 0.92, profit: 64, risk: "LOW", sentiment: "NEUTRAL", rec: "BUY", lastAnalysis: "1m ago", suggested: 20000, expRet: "+5.1%", conf: 71 },
  { sym: "BAJAJ FIN", sector: "Finance", price: 7234.5, chg: 3.14, profit: 68, risk: "MED", sentiment: "POSITIVE", rec: "BUY", lastAnalysis: "4m ago", suggested: 30000, expRet: "+9.0%", conf: 79 },
  { sym: "WIPRO", sector: "IT", price: 567.8, chg: -1.23, profit: 39, risk: "HIGH", sentiment: "NEGATIVE", rec: "SELL", lastAnalysis: "2m ago", suggested: 0, expRet: "+8.8%", conf: 72 },
  { sym: "ICICI BANK", sector: "Finance", price: 1189.2, chg: 0.45, profit: 55, risk: "LOW", sentiment: "NEUTRAL", rec: "HOLD", lastAnalysis: "6m ago", suggested: 0, expRet: "+3.4%", conf: 49 },
  { sym: "MARUTI", sector: "Automobile", price: 12450.0, chg: 1.89, profit: 61, risk: "MED", sentiment: "POSITIVE", rec: "BUY", lastAnalysis: "7m ago", suggested: 22000, expRet: "+7.8%", conf: 68 },
  { sym: "SUN PHARMA", sector: "Healthcare", price: 1689.4, chg: 0.67, profit: 53, risk: "LOW", sentiment: "NEUTRAL", rec: "HOLD", lastAnalysis: "9m ago", suggested: 0, expRet: "+4.0%", conf: 54 },
  { sym: "ITC", sector: "Consumer Goods", price: 467.3, chg: -0.34, profit: 47, risk: "LOW", sentiment: "NEGATIVE", rec: "HOLD", lastAnalysis: "5m ago", suggested: 0, expRet: "+2.1%", conf: 46 },
];

const WATCHLIST = [
  { sym: "MARUTI", price: 12450.0, risk: "MED", sentiment: "POSITIVE", rec: "BUY", expRet: "+7.8%" },
  { sym: "ICICI BANK", price: 1189.2, risk: "LOW", sentiment: "NEUTRAL", rec: "HOLD", expRet: "+3.4%" },
  { sym: "SUN PHARMA", price: 1689.4, risk: "LOW", sentiment: "NEUTRAL", rec: "HOLD", expRet: "+4.0%" },
  { sym: "ITC", price: 467.3, risk: "LOW", sentiment: "NEGATIVE", rec: "HOLD", expRet: "+2.1%" },
];

const AI_REASONS = {
  RELIANCE: { entryZone: "2960 – 2995", target: 3180, sl: 2890, rr: "2.4 : 1", reasons: [
    { ok: true, text: "Positive news sentiment (Jio subscriber milestone)" },
    { ok: true, text: "Bullish trend on daily and weekly timeframe" },
    { ok: true, text: "Revenue growth of 8.2% QoQ in latest results" },
    { ok: false, text: "Resistance zone near ₹3,020 may cause short-term pullback" },
  ], explain: "RELIANCE shows a confluence of bullish signals: price is trending above both the 20-day and 50-day moving averages, RSI sits in healthy territory at 64 (not yet overbought), and MACD has a positive crossover. Combined with strong recent news flow around Jio's subscriber growth and stable earnings, the model assigns a 73% probability of the stock reaching its target zone within the stated timeframe. The main risk is a known resistance band just above current price." },
  "BAJAJ FIN": { entryZone: "7180 – 7220", target: 7850, sl: 6980, rr: "2.7 : 1", reasons: [
    { ok: true, text: "Q1 net profit up 14% YoY with improving asset quality" },
    { ok: true, text: "Cup & Handle pattern confirmed on daily chart" },
    { ok: true, text: "Sector-wide tailwind in Financial Services (+1.34% today)" },
    { ok: false, text: "Higher volatility (MED risk) — wider stop required" },
  ], explain: "BAJAJ FIN's earnings beat combined with a textbook Cup & Handle breakout pattern gives the model high conviction. Profit probability of 68% reflects strong fundamentals offset by sector volatility. Position sizing should account for the wider stop-loss distance." },
  WIPRO: { entryZone: "572 – 578", target: 520, sl: 595, rr: "2.1 : 1", reasons: [
    { ok: true, text: "Head & Shoulders pattern confirms bearish reversal" },
    { ok: true, text: "Negative sentiment from 3 major sources on IT spending" },
    { ok: false, text: "Oversold on RSI — possible short-term bounce risk" },
  ], explain: "The SELL signal on WIPRO stems from a confirmed Head & Shoulders bearish pattern plus deteriorating IT sector sentiment amid slowing US tech spending. RSI is approaching oversold territory, which introduces some risk of a relief bounce before continuation." },
  INFY: { entryZone: "1825 – 1845", target: 2050, sl: 1780, rr: "3.2 : 1", reasons: [
    { ok: true, text: "Ascending Triangle pattern nearing breakout" },
    { ok: true, text: "Strong historical support at ₹1,780" },
    { ok: false, text: "Sector sentiment mixed amid IT spending concerns" },
  ], explain: "INFY's Ascending Triangle suggests building bullish pressure with a favorable 3.2:1 risk/reward ratio. The wider target timeframe (10–20 days) reflects the slower-developing nature of this pattern. Mixed sector sentiment tempers confidence slightly to 65%." },
};

const PREDICTIONS = [
  { sym: "RELIANCE", bullish: 73, bearish: 27, ret5d: "+6.7%", conf5d: 81, risk5d: 28, shortTrend: "Bullish", medTrend: "Bullish", trendPred: "BULLISH", trendConf: 84, strength: 78 },
  { sym: "TCS", bullish: 41, bearish: 59, ret5d: "+1.2%", conf5d: 54, risk5d: 46, shortTrend: "Sideways", medTrend: "Bearish", trendPred: "SIDEWAYS", trendConf: 58, strength: 41 },
  { sym: "INFY", bullish: 65, bearish: 35, ret5d: "+11.4%", conf5d: 65, risk5d: 38, shortTrend: "Bullish", medTrend: "Bullish", trendPred: "BULLISH", trendConf: 71, strength: 66 },
  { sym: "HDFC BANK", bullish: 64, bearish: 36, ret5d: "+5.1%", conf5d: 71, risk5d: 24, shortTrend: "Bullish", medTrend: "Sideways", trendPred: "BULLISH", trendConf: 68, strength: 59 },
  { sym: "BAJAJ FIN", bullish: 68, bearish: 32, ret5d: "+9.0%", conf5d: 79, risk5d: 41, shortTrend: "Bullish", medTrend: "Bullish", trendPred: "BULLISH", trendConf: 79, strength: 74 },
  { sym: "WIPRO", bullish: 28, bearish: 72, ret5d: "-3.8%", conf5d: 72, risk5d: 52, shortTrend: "Bearish", medTrend: "Bearish", trendPred: "BEARISH", trendConf: 72, strength: 69 },
];

const COMPANY_DEEP = {
  overview: { mc: "₹20.2L Cr", pe: 28.4, eps: 105.2, rev: "₹9.04L Cr", profitGrowth: "+8.2%", debt: "₹1.18L Cr", shareholding: [["Promoters", 50.3], ["FII", 22.4], ["DII", 16.1], ["Public", 11.2]] },
  quarterly: [
    { q: "Q1 FY26", rev: "2.29L Cr", profit: "18,640 Cr", growth: "+8.2%" },
    { q: "Q4 FY25", rev: "2.21L Cr", profit: "17,200 Cr", growth: "+5.1%" },
    { q: "Q3 FY25", rev: "2.16L Cr", profit: "16,890 Cr", growth: "+4.4%" },
    { q: "Q2 FY25", rev: "2.10L Cr", profit: "15,980 Cr", growth: "+3.2%" },
  ],
  management: [
    { name: "Mukesh D. Ambani", role: "Chairman & MD", tenure: "29 years" },
    { name: "Nikhil R. Meswani", role: "Executive Director", tenure: "27 years" },
    { name: "V. Sashi Kumar", role: "CFO", tenure: "6 years" },
  ],
  competitors: [
    { sym: "ONGC", mc: "₹4.1L Cr", pe: 9.8 },
    { sym: "IOC", mc: "₹2.3L Cr", pe: 7.4 },
    { sym: "BPCL", mc: "₹1.5L Cr", pe: 8.9 },
  ],
  historical: [["2021", "+12.4%"], ["2022", "-8.1%"], ["2023", "+24.6%"], ["2024", "+9.8%"], ["2025 YTD", "+18.3%"]],
  risks: [
    "Crude oil price volatility directly impacts refining margins",
    "Heavy capex in telecom and retail increases near-term debt load",
    "Regulatory risk around retail FDI norms",
    "Global slowdown could affect petrochemical demand",
  ],
};

const NEWS_TIMELINE = [
  { time: "09:15", event: "Market opens — RELIANCE gaps up 1.1% on Jio news", impact: "+1.1%" },
  { time: "10:30", event: "RBI policy statement released — neutral tone", impact: "0.0%" },
  { time: "11:45", event: "Bajaj Finance Q1 results beat estimates", impact: "+2.8%" },
  { time: "13:20", event: "Global IT spending report weighs on TCS, INFY, WIPRO", impact: "-1.4%" },
  { time: "14:50", event: "SEBI F&O margin rule update published", impact: "-0.3%" },
];

const NAV = [
  { id: "home", icon: "⊞", label: "Dashboard" },
  { id: "finance", icon: "◈", label: "Finance" },
  { id: "portfolio", icon: "◉", label: "Portfolio" },
  { id: "screener", icon: "☰", label: "Market" },
  { id: "research", icon: "⊡", label: "Research" },
  { id: "charts", icon: "▦", label: "Charts" },
  { id: "ai", icon: "◆", label: "AI Engine" },
  { id: "predict", icon: "⟁", label: "Predict" },
  { id: "watchlist", icon: "★", label: "Watchlist" },
  { id: "news", icon: "◑", label: "News" },
  { id: "trades", icon: "◐", label: "Trades" },
  { id: "alerts", icon: "◬", label: "Alerts" },
  { id: "risk", icon: "⊘", label: "Risk" },
  { id: "settings", icon: "◧", label: "Settings" },
];

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────
const mono = "JetBrains Mono, Consolas, monospace";
const sans = "Inter, system-ui, sans-serif";

function Badge({ t }) {
  const map = {
    BUY: [C.greenDim, C.green], SELL: [C.redDim, C.red],
    POSITIVE: [C.greenDim, C.green], NEGATIVE: [C.redDim, C.red],
    NEUTRAL: [C.amberDim, C.amber], LOW: [C.greenDim, C.green],
    MED: [C.amberDim, C.amber], HIGH: [C.redDim, C.red],
    OPEN: [C.cyanDim, C.cyan], CLOSED: [C.dim, C.muted],
    AI: [C.purpleDim, C.purple], PRICE: [C.cyanDim, C.cyan],
    NEWS: [C.amberDim, C.amber], TRADE: [C.redDim, C.red],
    GOAL: [C.greenDim, C.green], RISK: [C.redDim, C.red],
  };
  const [bg, fg] = map[t] || [C.cyanDim, C.cyan];
  return <span style={{ background: bg, color: fg, border: `1px solid ${fg}33`, fontFamily: mono, fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 3, letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap" }}>{t}</span>;
}

function Bar({ val, max, color }) {
  return (
    <div style={{ height: 4, background: C.dim, borderRadius: 2, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.min((val / max) * 100, 100)}%`, background: color, borderRadius: 2 }} />
    </div>
  );
}

function Ring({ val, max = 100, color, size = 56, label }) {
  const r = (size - 8) / 2, circ = 2 * Math.PI * r, fill = (val / max) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.dim} strokeWidth="5" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: mono, fontSize: size < 50 ? 10 : 12, fontWeight: 800, color }}>{val}%</span>
        {label && <span style={{ fontFamily: sans, fontSize: 8, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>}
      </div>
    </div>
  );
}

function Spark({ data, up, w = 72, h = 28 }) {
  const min = Math.min(...data), max = Math.max(...data), rng = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / rng) * h}`).join(" ");
  const col = up ? C.green : C.red;
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={col} strokeWidth="1.5" />
    </svg>
  );
}

function Card({ children, style = {} }) {
  return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, ...style }}>{children}</div>;
}

function Stat({ label, value, sub, color, icon }) {
  return (
    <Card style={{ padding: "14px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <span style={{ fontFamily: sans, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
        {icon && <span style={{ fontSize: 15, opacity: 0.4 }}>{icon}</span>}
      </div>
      <div style={{ fontFamily: mono, fontSize: 20, fontWeight: 800, color: color || C.text, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontFamily: sans, fontSize: 10, color: C.muted, marginTop: 6 }}>{sub}</div>}
    </Card>
  );
}

function SecHead({ title, sub }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.text }}>{title}</div>
      {sub && <div style={{ fontFamily: sans, fontSize: 11, color: C.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ─── TICKER ───────────────────────────────────────────────────────────────────
function Ticker() {
  const ref = useRef(null);
  const pos = useRef(0);
  useEffect(() => {
    let raf;
    const go = () => {
      pos.current -= 0.5;
      if (ref.current) {
        const half = ref.current.scrollWidth / 2;
        if (Math.abs(pos.current) >= half) pos.current = 0;
        ref.current.style.transform = `translateX(${pos.current}px)`;
      }
      raf = requestAnimationFrame(go);
    };
    raf = requestAnimationFrame(go);
    return () => cancelAnimationFrame(raf);
  }, []);
  const items = [...TICKERS, ...TICKERS];
  return (
    <div style={{ background: "#050A12", borderBottom: `1px solid ${C.border}`, overflow: "hidden", height: 32, display: "flex", alignItems: "center" }}>
      <div ref={ref} style={{ display: "flex", alignItems: "center", willChange: "transform" }}>
        {items.map((t, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0 18px", borderRight: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: mono, fontSize: 10, color: C.muted }}>{t.sym}</span>
            <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, color: C.text }}>{t.price}</span>
            <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 800, color: t.up ? C.green : C.red }}>{t.chg}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── CANDLESTICK CHART ───────────────────────────────────────────────────────
function CandleChart({ symbol = "RELIANCE" }) {
  const candles = useRef(Array.from({ length: 40 }, (_, i) => {
    const base = 2900 + Math.sin(i * 0.35) * 100 + i * 2;
    const open = base + (Math.random() - 0.5) * 40;
    const close = open + (Math.random() - 0.5) * 70;
    const high = Math.max(open, close) + Math.random() * 25;
    const low = Math.min(open, close) - Math.random() * 25;
    return { open, close, high, low };
  })).current;
  const allP = candles.flatMap(c => [c.high, c.low]);
  const minP = Math.min(...allP), maxP = Math.max(...allP), rng = maxP - minP;
  const W = 460, H = 160;
  const toY = v => H - ((v - minP) / rng) * H;
  const cw = W / candles.length - 1.5;
  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block" }}>
      {candles.map((c, i) => {
        const x = i * (W / candles.length);
        const up = c.close >= c.open;
        const col = up ? C.green : C.red;
        const bTop = toY(Math.max(c.open, c.close));
        const bH = Math.max(Math.abs(toY(c.open) - toY(c.close)), 1);
        return (
          <g key={i}>
            <line x1={x + cw / 2} y1={toY(c.high)} x2={x + cw / 2} y2={toY(c.low)} stroke={col} strokeWidth="0.8" opacity="0.5" />
            <rect x={x} y={bTop} width={cw} height={bH} fill={col} rx="0.5" />
          </g>
        );
      })}
    </svg>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "#00000099", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, maxWidth: 520, width: "100%", maxHeight: "85vh", overflowY: "auto", padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontFamily: mono, fontSize: 14, fontWeight: 800, color: C.text }}>{title}</span>
          <button onClick={onClose} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, width: 28, height: 28, fontSize: 14 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────
function Dashboard({ isMobile }) {
  const totalV = PORTFOLIO.reduce((s, x) => s + x.qty * x.ltp, 0);
  const totalC = PORTFOLIO.reduce((s, x) => s + x.qty * x.avg, 0);
  const pnl = totalV - totalC;
  const pnlPct = ((pnl / totalC) * 100).toFixed(2);
  const cols = isMobile ? "1fr 1fr" : "repeat(4, 1fr)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 10 }}>
        <Stat label="Net Worth" value="₹7.12L" sub="↑ ₹24,300 this month" color={C.cyan} icon="◈" />
        <Stat label="Portfolio" value={`₹${(totalV / 100000).toFixed(2)}L`} sub={`${pnl > 0 ? "+" : ""}₹${Math.abs(pnl / 1000).toFixed(1)}K (${pnl > 0 ? "+" : ""}${pnlPct}%)`} color={pnl > 0 ? C.green : C.red} icon="◉" />
        <Stat label="Bank Balance" value="₹2.85L" sub="Predicted: ₹3.14L next month" icon="◎" />
        <Stat label="Savings Rate" value="38.5%" sub="₹32,700 saved this month" color={C.green} icon="◆" />
      </div>

      {/* AI Signals */}
      <Card style={{ padding: 16 }}>
        <SecHead title="AI Trade Signals" sub="ML-powered — for reference only, not financial advice" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {AI_SIGNALS.slice(0, isMobile ? 2 : 4).map((s, i) => (
            <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: mono, fontSize: 14, fontWeight: 800, color: C.text }}>{s.sym}</span>
                  <Badge t={s.type} /><Badge t={s.risk} />
                  <span style={{ fontFamily: mono, fontSize: 10, color: C.muted }}>{s.pattern}</span>
                </div>
                <span style={{ fontFamily: mono, fontSize: 10, color: C.muted }}>{s.tf}</span>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Ring val={s.conf} color={C.cyan} size={isMobile ? 48 : 56} label="Conf" />
                <Ring val={s.profit} color={C.green} size={isMobile ? 48 : 56} label="Profit" />
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px" }}>
                  {[["Entry", `₹${s.entry.toLocaleString()}`, C.text], ["Target", `₹${s.target.toLocaleString()}`, C.green], ["Stop Loss", `₹${s.sl.toLocaleString()}`, C.red], ["Expected", s.ret, C.cyan]].map(([l, v, col]) => (
                    <div key={l}>
                      <div style={{ fontFamily: sans, fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{l}</div>
                      <div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: col }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Sectors + Snapshot */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
        <Card style={{ padding: 16 }}>
          <SecHead title="Sector Performance" sub="Today's movement" />
          {SECTORS.map((s, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontFamily: sans, fontSize: 11, color: C.text }}>{s.name}</span>
                <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 800, color: s.chg >= 0 ? C.green : C.red }}>{s.chg >= 0 ? "+" : ""}{s.chg}%</span>
              </div>
              <Bar val={Math.abs(s.chg)} max={4} color={s.chg >= 0 ? C.green : C.red} />
            </div>
          ))}
        </Card>
        <Card style={{ padding: 16 }}>
          <SecHead title="Financial Snapshot" />
          {[["Monthly Income", "+₹85,000", C.green], ["Monthly Expenses", "-₹52,300", C.red], ["Net Savings", "₹32,700", C.cyan], ["Investments", "₹4.27L", C.purple]].map(([l, v, col]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontFamily: sans, fontSize: 12, color: C.muted }}>{l}</span>
              <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 800, color: col }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontFamily: sans, fontSize: 11, color: C.muted }}>Emergency Fund</span>
              <span style={{ fontFamily: mono, fontSize: 11, color: C.amber }}>59%</span>
            </div>
            <Bar val={150000} max={255000} color={C.amber} />
          </div>
        </Card>
      </div>

      {/* News */}
      <Card style={{ padding: 16 }}>
        <SecHead title="Latest News & Sentiment" sub="AI-scored" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {NEWS.slice(0, isMobile ? 3 : 5).map((n, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "10px 12px", background: C.bg, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <div style={{ width: 44, height: 44, borderRadius: 7, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: n.sent === "POSITIVE" ? C.greenDim : n.sent === "NEGATIVE" ? C.redDim : C.amberDim }}>
                <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 800, color: n.sent === "POSITIVE" ? C.green : n.sent === "NEGATIVE" ? C.red : C.amber }}>{n.score > 0 ? "+" : ""}{n.score.toFixed(2)}</span>
                <span style={{ fontFamily: sans, fontSize: 8, color: C.muted }}>score</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: sans, fontSize: 11, color: C.text, lineHeight: 1.5, marginBottom: 5 }}>{n.title}</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: sans, fontSize: 10, color: C.muted }}>{n.src} · {n.time} ago</span>
                  <Badge t={n.sent} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function FinancePage({ isMobile }) {
  const cols = isMobile ? "1fr 1fr" : "repeat(4, 1fr)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 10 }}>
        <Stat label="Bank Balance" value="₹2.85L" color={C.cyan} icon="◈" />
        <Stat label="Monthly Income" value="₹85,000" color={C.green} sub="Salary + Freelance" />
        <Stat label="Expenses" value="₹52,300" color={C.red} sub="61.5% of income" />
        <Stat label="Investments" value="₹4.27L" color={C.purple} sub="↑ 12.4% YTD" />
      </div>

      {/* Financial Health Score */}
      <Card style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Ring val={81} color={C.green} size={72} />
            <div>
              <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.text }}>Financial Health Score</div>
              <div style={{ fontFamily: mono, fontSize: 11, color: C.muted }}>81 / 100 — Strong</div>
            </div>
          </div>
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10, minWidth: 220 }}>
            {[["Savings Rate", 85, C.green], ["Debt Ratio", 92, C.green], ["Emergency Cover", 59, C.amber], ["Goal Progress", 68, C.cyan]].map(([l, v, col]) => (
              <div key={l}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontFamily: sans, fontSize: 10, color: C.muted }}>{l}</span>
                  <span style={{ fontFamily: mono, fontSize: 10, color: col }}>{v}</span>
                </div>
                <Bar val={v} max={100} color={col} />
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
        {/* Goals */}
        <Card style={{ padding: 16 }}>
          <SecHead title="Financial Goals" sub="Progress tracker" />
          {GOALS.map((g, i) => {
            const pct = ((g.saved / g.target) * 100).toFixed(1);
            return (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 14 }}>{g.icon}</span>
                    <span style={{ fontFamily: sans, fontSize: 12, color: C.text }}>{g.name}</span>
                  </div>
                  <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, color: C.cyan }}>{pct}%</span>
                </div>
                <Bar val={g.saved} max={g.target} color={C.cyan} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontFamily: mono, fontSize: 10, color: C.muted }}>₹{(g.saved / 1000).toFixed(0)}K saved</span>
                  <span style={{ fontFamily: sans, fontSize: 10, color: C.muted }}>{g.deadline}</span>
                </div>
              </div>
            );
          })}
        </Card>

        {/* Budget */}
        <Card style={{ padding: 16 }}>
          <SecHead title="Budget Planner" sub="Monthly allocation" />
          {BUDGET.map((b, i) => {
            const over = b.spent > b.budget;
            return (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontFamily: sans, fontSize: 11, color: C.text }}>{b.cat}</span>
                  <span style={{ fontFamily: mono, fontSize: 10, color: over ? C.red : C.muted }}>₹{b.spent.toLocaleString()} / ₹{b.budget.toLocaleString()}</span>
                </div>
                <Bar val={b.spent} max={b.budget} color={over ? C.red : b.color} />
              </div>
            );
          })}
        </Card>
      </div>

      {/* AI Coach */}
      <Card style={{ padding: 16 }}>
        <SecHead title="AI Financial Coach" sub="Personalised to your financial profile" />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
          {[
            { icon: "◆", title: "Boost SIP by ₹5,000/mo", desc: "Your income growth supports increasing SIP to ₹20,000. This can advance your home goal by 4 months.", col: C.cyan },
            { icon: "◬", title: "Build Emergency Fund Faster", desc: "Allocate ₹8,500/month for 12 months to hit your 6-month expense safety target.", col: C.amber },
            { icon: "◉", title: "Trim Transport Budget", desc: "Transport is 24% over budget. Carpooling or metro could save ₹1,200/month.", col: C.green },
          ].map((t, i) => (
            <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 18, color: t.col, marginBottom: 8 }}>{t.icon}</div>
              <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 6 }}>{t.title}</div>
              <div style={{ fontFamily: sans, fontSize: 11, color: C.muted, lineHeight: 1.6 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Balance Prediction */}
      <Card style={{ padding: 16 }}>
        <SecHead title="Balance Forecast" sub="AI-predicted bank balance for next 6 months" />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(6, 1fr)", gap: 8 }}>
          {[["Jul", 314000], ["Aug", 348000], ["Sep", 281000], ["Oct", 369000], ["Nov", 402000], ["Dec", 458000]].map(([m, v]) => (
            <div key={m} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontFamily: sans, fontSize: 10, color: C.muted, marginBottom: 4 }}>{m} 2025</div>
              <div style={{ fontFamily: mono, fontSize: 12, fontWeight: 800, color: C.cyan }}>₹{(v / 1000).toFixed(0)}K</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function PortfolioPage({ isMobile }) {
  const totalV = PORTFOLIO.reduce((s, x) => s + x.qty * x.ltp, 0);
  const totalC = PORTFOLIO.reduce((s, x) => s + x.qty * x.avg, 0);
  const pnl = totalV - totalC;
  const cols = isMobile ? "1fr 1fr" : "repeat(4, 1fr)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 10 }}>
        <Stat label="Current Value" value={`₹${(totalV / 100000).toFixed(2)}L`} color={C.cyan} />
        <Stat label="Total P&L" value={`${pnl > 0 ? "+" : ""}₹${Math.abs(pnl / 1000).toFixed(1)}K`} color={pnl > 0 ? C.green : C.red} sub={`${pnl > 0 ? "+" : ""}${((pnl / totalC) * 100).toFixed(2)}% overall`} />
        <Stat label="Day's Gain" value="+₹4,823" color={C.green} sub="+0.98% today" />
        <Stat label="Positions" value="6" sub="3 profitable · 1 loss · 2 flat" />
      </div>

      {/* Portfolio Health Score */}
      <Card style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Ring val={74} color={C.green} size={72} />
            <div>
              <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: C.text }}>Portfolio Health</div>
              <div style={{ fontFamily: mono, fontSize: 11, color: C.muted }}>74 / 100 — Good</div>
            </div>
          </div>
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(5, 1fr)", gap: 10, minWidth: 260 }}>
            {[["Diversification", 68, C.cyan], ["Risk Level", 58, C.amber], ["Cash Reserve", 82, C.green], ["Sector Balance", 71, C.cyan], ["Concentration", 64, C.amber]].map(([l, v, col]) => (
              <div key={l}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontFamily: sans, fontSize: 10, color: C.muted }}>{l}</span>
                  <span style={{ fontFamily: mono, fontSize: 10, color: col }}>{v}</span>
                </div>
                <Bar val={v} max={100} color={col} />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Mobile: Cards, Desktop: Table */}
      <Card style={{ padding: 16 }}>
        <SecHead title="Holdings" sub={`Updated live · ${PORTFOLIO.length} positions`} />
        {isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {PORTFOLIO.map((s, i) => {
              const pnl = (s.ltp - s.avg) * s.qty;
              const ret = ((s.ltp - s.avg) / s.avg * 100).toFixed(2);
              const up = pnl >= 0;
              return (
                <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div>
                      <span style={{ fontFamily: mono, fontSize: 14, fontWeight: 800, color: C.text }}>{s.sym}</span>
                      <span style={{ fontFamily: sans, fontSize: 10, color: C.muted, marginLeft: 8 }}>{s.sector}</span>
                    </div>
                    <Spark data={[s.avg * 0.97, s.avg * 0.99, s.avg, s.ltp * 0.98, s.ltp * 0.99, s.ltp]} up={up} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 4 }}>
                    {[["Qty", s.qty], ["Avg", `₹${s.avg}`], ["LTP", `₹${s.ltp.toFixed(0)}`], ["Return", `${up ? "+" : ""}${ret}%`]].map(([l, v]) => (
                      <div key={l}>
                        <div style={{ fontFamily: sans, fontSize: 9, color: C.muted }}>{l}</div>
                        <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, color: l === "Return" ? (up ? C.green : C.red) : C.text }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: sans, fontSize: 11, color: C.muted }}>P&L</span>
                    <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 800, color: up ? C.green : C.red }}>{up ? "+" : ""}₹{Math.abs(pnl).toFixed(0)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>{["Symbol", "Sector", "Qty", "Avg Price", "LTP", "P&L", "Return", "Trend"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontFamily: sans, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 1, borderBottom: `1px solid ${C.border}`, fontWeight: 600 }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {PORTFOLIO.map((s, i) => {
                  const p = (s.ltp - s.avg) * s.qty;
                  const r = ((s.ltp - s.avg) / s.avg * 100).toFixed(2);
                  const up = p >= 0;
                  return (
                    <tr key={i} style={{ borderBottom: `1px solid ${C.border}22` }}>
                      <td style={{ padding: "10px 12px" }}><span style={{ fontFamily: mono, fontSize: 13, fontWeight: 800, color: C.text }}>{s.sym}</span></td>
                      <td style={{ padding: "10px 12px" }}><span style={{ fontFamily: sans, fontSize: 11, color: C.muted }}>{s.sector}</span></td>
                      <td style={{ padding: "10px 12px" }}><span style={{ fontFamily: mono, fontSize: 12, color: C.text }}>{s.qty}</span></td>
                      <td style={{ padding: "10px 12px" }}><span style={{ fontFamily: mono, fontSize: 12, color: C.muted }}>₹{s.avg.toLocaleString()}</span></td>
                      <td style={{ padding: "10px 12px" }}>
                        <div><div style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.text }}>₹{s.ltp.toFixed(2)}</div>
                          <div style={{ fontFamily: mono, fontSize: 10, color: s.chg >= 0 ? C.green : C.red }}>{s.chg >= 0 ? "▲" : "▼"} {Math.abs(s.chg)}%</div></div>
                      </td>
                      <td style={{ padding: "10px 12px" }}><span style={{ fontFamily: mono, fontSize: 12, fontWeight: 800, color: up ? C.green : C.red }}>{up ? "+" : ""}₹{Math.abs(p).toFixed(0)}</span></td>
                      <td style={{ padding: "10px 12px" }}><span style={{ fontFamily: mono, fontSize: 12, color: up ? C.green : C.red }}>{up ? "+" : ""}{r}%</span></td>
                      <td style={{ padding: "10px 12px" }}><Spark data={[s.avg * 0.97, s.avg * 0.99, s.avg, s.ltp * 0.98, s.ltp]} up={up} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Sector allocation */}
      <Card style={{ padding: 16 }}>
        <SecHead title="Sector Allocation" />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
          {[{ name: "Information Technology", pct: 41, val: "₹1.73L", col: C.cyan },
            { name: "Financial Services", pct: 38, val: "₹1.61L", col: C.purple },
            { name: "Energy", pct: 21, val: "₹0.88L", col: C.amber }].map((s, i) => (
            <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, display: "flex", alignItems: "center", gap: 14 }}>
              <Ring val={s.pct} color={s.col} size={52} />
              <div>
                <div style={{ fontFamily: sans, fontSize: 12, color: C.text, marginBottom: 4 }}>{s.name}</div>
                <div style={{ fontFamily: mono, fontSize: 14, fontWeight: 800, color: s.col }}>{s.val}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Portfolio Monitoring + Alerts */}
      <Card style={{ padding: 16 }}>
        <SecHead title="Portfolio Monitoring" sub="Live tracking with sell, risk, and profit-target alerts" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {PORTFOLIO.map((s, i) => {
            const invested = s.qty * s.avg;
            const current = s.qty * s.ltp;
            const pnl = current - invested;
            const pnlPct = ((pnl / invested) * 100);
            const risk = Math.abs(s.chg) > 2 ? "HIGH" : Math.abs(s.chg) > 1 ? "MED" : "LOW";
            const sentiment = pnlPct > 2 ? "POSITIVE" : pnlPct < -2 ? "NEGATIVE" : "NEUTRAL";
            const rec = pnlPct > 8 ? "Consider booking profit" : pnlPct < -5 ? "Review stop-loss" : risk === "HIGH" ? "Monitor closely" : "Hold";
            const sigAlert = pnlPct > 8 ? { t: "GOAL", m: "Profit target zone reached" } : pnlPct < -5 ? { t: "RISK", m: "Approaching stop-loss zone" } : risk === "HIGH" ? { t: "PRICE", m: "High volatility detected today" } : null;
            return (
              <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: sigAlert ? 8 : 0 }}>
                  <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 800, color: C.text, width: isMobile ? "auto" : 100 }}>{s.sym}</span>
                  <span style={{ fontFamily: mono, fontSize: 11, color: C.muted }}>Qty {s.qty}</span>
                  <span style={{ fontFamily: mono, fontSize: 11, color: C.muted }}>Inv ₹{(invested / 1000).toFixed(1)}K</span>
                  <span style={{ fontFamily: mono, fontSize: 11, color: C.text }}>Val ₹{(current / 1000).toFixed(1)}K</span>
                  <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 800, color: pnl >= 0 ? C.green : C.red }}>{pnl >= 0 ? "+" : ""}₹{Math.abs(pnl).toFixed(0)} ({pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(1)}%)</span>
                  <Badge t={risk} /><Badge t={sentiment} />
                  <span style={{ fontFamily: sans, fontSize: 10, color: C.muted, marginLeft: "auto" }}>{rec}</span>
                </div>
                {sigAlert && (
                  <div style={{ display: "flex", gap: 8, alignItems: "center", background: `${sigAlert.t === "RISK" ? C.red : sigAlert.t === "GOAL" ? C.green : C.cyan}11`, border: `1px solid ${sigAlert.t === "RISK" ? C.red : sigAlert.t === "GOAL" ? C.green : C.cyan}33`, borderRadius: 6, padding: "6px 10px" }}>
                    <Badge t={sigAlert.t} />
                    <span style={{ fontFamily: sans, fontSize: 11, color: C.text }}>{sigAlert.m}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function ScreenerPage({ isMobile }) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("All");
  const [sortBy, setSortBy] = useState("profit");
  const [filter, setFilter] = useState("all");
  const [watched, setWatched] = useState(["MARUTI", "ICICI BANK", "SUN PHARMA", "ITC"]);
  const myHoldings = PORTFOLIO.map(p => p.sym);

  const sectors = ["All", ...Array.from(new Set(SCREENER.map(s => s.sector)))];

  let rows = SCREENER.filter(s => s.sym.toLowerCase().includes(query.toLowerCase()));
  if (sector !== "All") rows = rows.filter(s => s.sector === sector);
  if (filter === "watchlist") rows = rows.filter(s => watched.includes(s.sym));
  if (filter === "holdings") rows = rows.filter(s => myHoldings.includes(s.sym));
  const sortMap = { profit: s => -s.profit, risk: s => ({ LOW: 0, MED: 1, HIGH: 2 }[s.risk]), conf: s => -s.conf };
  rows = [...rows].sort((a, b) => sortMap[sortBy](a) - sortMap[sortBy](b));

  const toggleWatch = sym => setWatched(w => w.includes(sym) ? w.filter(x => x !== sym) : [...w, sym]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10 }}>
        <Stat label="Stocks Tracked" value={SCREENER.length.toString()} color={C.cyan} />
        <Stat label="AI Buy Signals" value={SCREENER.filter(s => s.rec === "BUY").length.toString()} color={C.green} />
        <Stat label="Watchlisted" value={watched.length.toString()} color={C.amber} icon="★" />
        <Stat label="In Portfolio" value={myHoldings.length.toString()} color={C.purple} />
      </div>

      <Card style={{ padding: 16 }}>
        <SecHead title="Market Screener" sub="All tracked stocks with AI-generated scores" />

        {/* Controls */}
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 10, marginBottom: 14 }}>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search stock symbol…" style={{
            flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: "9px 12px",
            color: C.text, fontFamily: mono, fontSize: 12, outline: "none"
          }} />
          <select value={sector} onChange={e => setSector(e.target.value)} style={{
            background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: "9px 12px",
            color: C.text, fontFamily: sans, fontSize: 12, outline: "none"
          }}>
            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
            background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: "9px 12px",
            color: C.text, fontFamily: sans, fontSize: 12, outline: "none"
          }}>
            <option value="profit">Sort: Profit Probability</option>
            <option value="risk">Sort: Risk (low first)</option>
            <option value="conf">Sort: Confidence</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[["all", "All Stocks"], ["watchlist", "★ Watchlist"], ["holdings", "My Investments"]].map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} style={{
              background: filter === k ? C.cyan : C.bg, color: filter === k ? C.bg : C.muted,
              border: `1px solid ${filter === k ? C.cyan : C.border}`, borderRadius: 6,
              fontFamily: sans, fontSize: 11, fontWeight: 600, padding: "6px 12px"
            }}>{l}</button>
          ))}
        </div>

        {/* Results */}
        {isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {rows.map((s, i) => (
              <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 800, color: C.text }}>{s.sym}</span>
                    <Badge t={s.rec === "BUY" ? "BUY" : s.rec === "SELL" ? "SELL" : "NEUTRAL"} />
                  </div>
                  <button onClick={() => toggleWatch(s.sym)} style={{ background: "transparent", border: "none", fontSize: 16, color: watched.includes(s.sym) ? C.amber : C.dim }}>★</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 8 }}>
                  <div><div style={{ fontFamily: sans, fontSize: 9, color: C.muted }}>Price</div><div style={{ fontFamily: mono, fontSize: 12, color: C.text }}>₹{s.price.toFixed(0)}</div></div>
                  <div><div style={{ fontFamily: sans, fontSize: 9, color: C.muted }}>Chg</div><div style={{ fontFamily: mono, fontSize: 12, color: s.chg >= 0 ? C.green : C.red }}>{s.chg >= 0 ? "+" : ""}{s.chg}%</div></div>
                  <div><div style={{ fontFamily: sans, fontSize: 9, color: C.muted }}>Sector</div><div style={{ fontFamily: sans, fontSize: 10, color: C.text }}>{s.sector}</div></div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Ring val={s.profit} color={C.green} size={40} />
                  <Ring val={s.conf} color={C.cyan} size={40} />
                  <Badge t={s.risk} />
                  <Badge t={s.sentiment} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>{["★", "Stock", "Sector", "Price", "Chg%", "Profit Prob", "Risk", "Sentiment", "AI Rec", "Suggested ₹", "Exp. Return", "Confidence", "Updated"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontFamily: sans, fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, borderBottom: `1px solid ${C.border}`, fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {rows.map((s, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}22` }}>
                    <td style={{ padding: "8px 10px" }}><button onClick={() => toggleWatch(s.sym)} style={{ background: "transparent", border: "none", fontSize: 14, color: watched.includes(s.sym) ? C.amber : C.dim }}>★</button></td>
                    <td style={{ padding: "8px 10px" }}><span style={{ fontFamily: mono, fontSize: 12, fontWeight: 800, color: C.text }}>{s.sym}</span></td>
                    <td style={{ padding: "8px 10px" }}><span style={{ fontFamily: sans, fontSize: 10, color: C.muted }}>{s.sector}</span></td>
                    <td style={{ padding: "8px 10px" }}><span style={{ fontFamily: mono, fontSize: 11, color: C.text }}>₹{s.price.toFixed(0)}</span></td>
                    <td style={{ padding: "8px 10px" }}><span style={{ fontFamily: mono, fontSize: 11, color: s.chg >= 0 ? C.green : C.red }}>{s.chg >= 0 ? "+" : ""}{s.chg}%</span></td>
                    <td style={{ padding: "8px 10px" }}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><Bar val={s.profit} max={100} color={C.green} /><span style={{ fontFamily: mono, fontSize: 10, color: C.green }}>{s.profit}%</span></div></td>
                    <td style={{ padding: "8px 10px" }}><Badge t={s.risk} /></td>
                    <td style={{ padding: "8px 10px" }}><Badge t={s.sentiment} /></td>
                    <td style={{ padding: "8px 10px" }}><Badge t={s.rec === "BUY" ? "BUY" : s.rec === "SELL" ? "SELL" : "NEUTRAL"} /></td>
                    <td style={{ padding: "8px 10px" }}><span style={{ fontFamily: mono, fontSize: 11, color: C.muted }}>{s.suggested > 0 ? `₹${(s.suggested / 1000).toFixed(0)}K` : "—"}</span></td>
                    <td style={{ padding: "8px 10px" }}><span style={{ fontFamily: mono, fontSize: 11, color: C.cyan, fontWeight: 700 }}>{s.expRet}</span></td>
                    <td style={{ padding: "8px 10px" }}><span style={{ fontFamily: mono, fontSize: 11, color: C.text }}>{s.conf}%</span></td>
                    <td style={{ padding: "8px 10px" }}><span style={{ fontFamily: sans, fontSize: 10, color: C.muted }}>{s.lastAnalysis}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {rows.length === 0 && <div style={{ textAlign: "center", padding: 30, fontFamily: sans, fontSize: 12, color: C.muted }}>No stocks match your filters.</div>}
      </Card>
    </div>
  );
}

function WatchlistPage({ isMobile }) {
  const [items, setItems] = useState(WATCHLIST);
  const remove = sym => setItems(it => it.filter(x => x.sym !== sym));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 10 }}>
        <Stat label="Watchlisted" value={items.length.toString()} color={C.amber} icon="★" />
        <Stat label="BUY Signals" value={items.filter(i => i.rec === "BUY").length.toString()} color={C.green} />
        <Stat label="Avg Expected Return" value="+4.3%" color={C.cyan} />
      </div>
      <Card style={{ padding: 16 }}>
        <SecHead title="Watchlist" sub="Stocks you're tracking but haven't invested in yet" />
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: 30, fontFamily: sans, fontSize: 12, color: C.muted }}>Your watchlist is empty. Add stocks from the Market screener.</div>
        ) : isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {items.map((s, i) => (
              <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 800, color: C.text }}>{s.sym}</span>
                  <button onClick={() => remove(s.sym)} style={{ background: "transparent", border: "none", color: C.muted, fontSize: 12 }}>Remove</button>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: mono, fontSize: 12, color: C.text }}>₹{s.price.toFixed(0)}</span>
                  <Badge t={s.risk} /><Badge t={s.sentiment} /><Badge t={s.rec} />
                  <span style={{ fontFamily: mono, fontSize: 11, color: C.cyan, marginLeft: "auto" }}>{s.expRet}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Stock", "Price", "Risk", "Sentiment", "AI Recommendation", "Expected Return", ""].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontFamily: sans, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 1, borderBottom: `1px solid ${C.border}`, fontWeight: 600 }}>{h}</th>
              ))}</tr></thead>
              <tbody>
                {items.map((s, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}22` }}>
                    <td style={{ padding: "10px 12px" }}><span style={{ fontFamily: mono, fontSize: 13, fontWeight: 800, color: C.text }}>{s.sym}</span></td>
                    <td style={{ padding: "10px 12px" }}><span style={{ fontFamily: mono, fontSize: 12, color: C.text }}>₹{s.price.toFixed(0)}</span></td>
                    <td style={{ padding: "10px 12px" }}><Badge t={s.risk} /></td>
                    <td style={{ padding: "10px 12px" }}><Badge t={s.sentiment} /></td>
                    <td style={{ padding: "10px 12px" }}><Badge t={s.rec} /></td>
                    <td style={{ padding: "10px 12px" }}><span style={{ fontFamily: mono, fontSize: 12, color: C.cyan, fontWeight: 700 }}>{s.expRet}</span></td>
                    <td style={{ padding: "10px 12px" }}><button onClick={() => remove(s.sym)} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 5, padding: "3px 10px", fontFamily: sans, fontSize: 10 }}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function PredictPage({ isMobile }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ padding: "12px 16px", background: C.amberDim, border: `1px solid ${C.amber}33` }}>
        <span style={{ fontFamily: sans, fontSize: 11, color: C.amber, lineHeight: 1.6 }}>⚠ All figures below are probability estimates from the AI model. They are not guarantees of profit or exact future prices.</span>
      </Card>
      {PREDICTIONS.map((p, i) => {
        const trendColor = p.trendPred === "BULLISH" ? C.green : p.trendPred === "BEARISH" ? C.red : C.amber;
        const trendDot = p.trendPred === "BULLISH" ? "🟢" : p.trendPred === "BEARISH" ? "🔴" : "🟡";
        return (
          <Card key={i} style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
              <span style={{ fontFamily: mono, fontSize: 15, fontWeight: 800, color: C.text }}>{p.sym}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>{trendDot}</span>
                <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 800, color: trendColor }}>{p.trendPred}</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
              {/* Next Day */}
              <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
                <div style={{ fontFamily: sans, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Next Day Probability</div>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <Ring val={p.bullish} color={C.green} size={56} label="Bullish" />
                  <Ring val={p.bearish} color={C.red} size={56} label="Bearish" />
                </div>
              </div>
              {/* Next 5 days */}
              <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
                <div style={{ fontFamily: sans, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Next 5 Days</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {[["Exp. Return", p.ret5d, C.cyan], ["Confidence", `${p.conf5d}%`, C.text], ["Risk", `${p.risk5d}%`, C.amber]].map(([l, v, col]) => (
                    <div key={l}>
                      <div style={{ fontFamily: sans, fontSize: 9, color: C.muted }}>{l}</div>
                      <div style={{ fontFamily: mono, fontSize: 13, fontWeight: 800, color: col }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10, marginTop: 12 }}>
              <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: "10px 12px" }}>
                <div style={{ fontFamily: sans, fontSize: 9, color: C.muted, marginBottom: 4 }}>Short-term Trend</div>
                <div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: p.shortTrend === "Bullish" ? C.green : p.shortTrend === "Bearish" ? C.red : C.amber }}>{p.shortTrend}</div>
              </div>
              <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: "10px 12px" }}>
                <div style={{ fontFamily: sans, fontSize: 9, color: C.muted, marginBottom: 4 }}>Medium-term Trend</div>
                <div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: p.medTrend === "Bullish" ? C.green : p.medTrend === "Bearish" ? C.red : C.amber }}>{p.medTrend}</div>
              </div>
              <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: "10px 12px" }}>
                <div style={{ fontFamily: sans, fontSize: 9, color: C.muted, marginBottom: 4 }}>Trend Confidence</div>
                <div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.cyan }}>{p.trendConf}%</div>
              </div>
              <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: "10px 12px" }}>
                <div style={{ fontFamily: sans, fontSize: 9, color: C.muted, marginBottom: 4 }}>Trend Strength</div>
                <Bar val={p.strength} max={100} color={trendColor} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function ResearchPageBase({ isMobile }) {
  const [selected, setSelected] = useState("RELIANCE");
  const stocks = ["RELIANCE", "TCS", "INFY", "HDFC BANK", "BAJAJ FIN", "WIPRO"];
  const info = {
    RELIANCE: { mc: "₹20.2L Cr", pe: 28.4, pb: 2.1, div: "0.3%", roe: "9.8%", de: 0.34, rev: "₹9.04L Cr", pat: "₹73,670 Cr", sector: "Energy", desc: "India's largest private sector company with businesses spanning petrochemicals, refining, telecom and retail." },
    TCS: { mc: "₹15.2L Cr", pe: 29.1, pb: 12.4, div: "1.8%", roe: "47.2%", de: 0.0, rev: "₹2.36L Cr", pat: "₹46,099 Cr", sector: "IT Services", desc: "India's largest IT services company and a global leader in digital transformation, consulting and business solutions." },
  };
  const d = info[selected] || info["TCS"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Stock Picker */}
      <Card style={{ padding: 16 }}>
        <SecHead title="Company Research Engine" sub="Select a stock to analyze" />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {stocks.map(s => (
            <button key={s} onClick={() => setSelected(s)} style={{
              background: selected === s ? C.cyan : C.bg, color: selected === s ? C.bg : C.muted,
              border: `1px solid ${selected === s ? C.cyan : C.border}`, borderRadius: 6,
              fontFamily: mono, fontSize: 11, fontWeight: 700, padding: "6px 14px", cursor: "pointer"
            }}>{s}</button>
          ))}
        </div>
        <div style={{ fontFamily: sans, fontSize: 12, color: C.muted, lineHeight: 1.7, marginBottom: 14, background: C.bg, padding: 12, borderRadius: 8, border: `1px solid ${C.border}` }}>
          <span style={{ fontFamily: sans, fontSize: 11, color: C.text }}>{d.desc}</span>
          <span style={{ fontFamily: mono, fontSize: 11, color: C.cyan, marginLeft: 8 }}>#{d.sector}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 10 }}>
          {[["Market Cap", d.mc, C.text], ["P/E Ratio", d.pe, C.cyan], ["P/B Ratio", d.pb, C.cyan], ["Dividend Yield", d.div, C.green], ["ROE", d.roe, C.green], ["D/E Ratio", d.de, d.de > 0.5 ? C.red : C.green], ["Revenue", d.rev, C.text], ["Net Profit", d.pat, C.green]].map(([l, v, col]) => (
            <div key={l} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: "10px 12px" }}>
              <div style={{ fontFamily: sans, fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{l}</div>
              <div style={{ fontFamily: mono, fontSize: 14, fontWeight: 800, color: col }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Fundamental Analysis */}
      <Card style={{ padding: 16 }}>
        <SecHead title="Fundamental Analysis Score" sub="AI-generated quality assessment" />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
          {[{ label: "Financial Health", val: 82, col: C.green }, { label: "Valuation", val: 56, col: C.amber }, { label: "Growth Quality", val: 74, col: C.cyan }, { label: "Management", val: 88, col: C.green }, { label: "Moat Strength", val: 79, col: C.cyan }, { label: "Overall Score", val: 76, col: C.purple }].map((m, i) => (
            <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, display: "flex", alignItems: "center", gap: 14 }}>
              <Ring val={m.val} color={m.col} size={52} />
              <div style={{ fontFamily: sans, fontSize: 12, color: C.text }}>{m.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Sectors */}
      <Card style={{ padding: 16 }}>
        <SecHead title="Stock Sector Categorization" />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 8 }}>
          {SECTORS.map((s, i) => (
            <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: sans, fontSize: 11, color: C.text, marginBottom: 3 }}>{s.name}</div>
                <div style={{ fontFamily: mono, fontSize: 10, color: C.muted }}>{s.stocks} stocks</div>
              </div>
              <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 800, color: s.chg >= 0 ? C.green : C.red }}>{s.chg >= 0 ? "+" : ""}{s.chg}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ChartsPage({ isMobile }) {
  const [tf, setTF] = useState("1D");
  const tfs = ["1D", "1W", "1M", "3M", "1Y"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ padding: 16 }}>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: 10, marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: mono, fontSize: 18, fontWeight: 800, color: C.text }}>RELIANCE · NSE</div>
            <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
              <span style={{ fontFamily: mono, fontSize: 26, fontWeight: 800, color: C.text }}>₹2,987.60</span>
              <span style={{ fontFamily: mono, fontSize: 14, fontWeight: 800, color: C.green }}>▲ +68.45 (+2.34%)</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {tfs.map(t => (
              <button key={t} onClick={() => setTF(t)} style={{ background: tf === t ? C.cyan : "transparent", border: `1px solid ${tf === t ? C.cyan : C.border}`, color: tf === t ? C.bg : C.muted, fontFamily: mono, fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 5, cursor: "pointer" }}>{t}</button>
            ))}
          </div>
        </div>
        <div style={{ background: C.bg, borderRadius: 8, padding: "12px 0 4px", marginBottom: 14, overflow: "hidden" }}>
          <CandleChart symbol="RELIANCE" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 8 }}>
          {[["Open", "₹2,932.10", C.text], ["High", "₹3,002.45", C.green], ["Low", "₹2,924.60", C.red], ["Volume", "42.8L", C.text], ["Mkt Cap", "₹20.2L Cr", C.text], ["P/E", "28.4", C.text], ["52W H", "₹3,217", C.green], ["52W L", "₹2,220", C.red]].map(([l, v, col]) => (
            <div key={l} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: "8px 12px" }}>
              <div style={{ fontFamily: sans, fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{l}</div>
              <div style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: col }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Technical Indicators */}
      <Card style={{ padding: 16 }}>
        <SecHead title="Technical Indicators" sub="Real-time signals for RELIANCE" />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10 }}>
          {INDICATORS.map((ind, i) => (
            <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ fontFamily: sans, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{ind.name}</div>
              <div style={{ fontFamily: mono, fontSize: 17, fontWeight: 800, color: ind.color, marginBottom: 3 }}>{ind.value}</div>
              <div style={{ fontFamily: sans, fontSize: 11, color: C.muted }}>{ind.signal}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Pattern Recognition */}
      <Card style={{ padding: 16 }}>
        <SecHead title="Pattern Recognition Engine" sub="AI-detected chart patterns" />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
          {[{ pattern: "Bull Flag", sym: "RELIANCE", tf: "1H", conf: 84, dir: "Bullish" }, { pattern: "Cup & Handle", sym: "BAJAJ FIN", tf: "1D", conf: 76, dir: "Bullish" }, { pattern: "Head & Shoulders", sym: "WIPRO", tf: "4H", conf: 71, dir: "Bearish" }].map((p, i) => (
            <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 800, color: C.text }}>{p.sym}</span>
                <span style={{ fontFamily: mono, fontSize: 10, color: C.muted }}>{p.tf}</span>
              </div>
              <div style={{ fontFamily: sans, fontSize: 12, color: C.cyan, marginBottom: 4 }}>{p.pattern}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <span style={{ fontFamily: sans, fontSize: 11, color: p.dir === "Bullish" ? C.green : C.red }}>{p.dir}</span>
                <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.cyan }}>{p.conf}% conf.</span>
              </div>
              <Bar val={p.conf} max={100} color={p.dir === "Bullish" ? C.green : C.red} />
            </div>
          ))}
        </div>
      </Card>

      {/* Deep Dive Tabs (Reliance data) */}
      <ResearchTabs isMobile={isMobile} />
    </div>
  );
}

function ResearchTabs({ isMobile }) {
  const [tab, setTab] = useState("overview");
  const tabs = ["overview", "financials", "quarterly", "management", "competitors", "news", "historical", "risks"];
  const labels = { overview: "Overview", financials: "Financials", quarterly: "Quarterly", management: "Management", competitors: "Competitors", news: "News", historical: "Historical", risks: "Risk Factors" };
  const d = COMPANY_DEEP;
  return (
    <Card style={{ padding: 16 }}>
      <SecHead title="Company Deep Dive — RELIANCE" sub="Detailed analysis across 8 categories" />
      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: tab === t ? C.cyan : C.bg, color: tab === t ? C.bg : C.muted,
            border: `1px solid ${tab === t ? C.cyan : C.border}`, borderRadius: 6,
            fontFamily: sans, fontSize: 11, fontWeight: 600, padding: "6px 12px", whiteSpace: "nowrap", flexShrink: 0
          }}>{labels[t]}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
          <div style={{ fontFamily: sans, fontSize: 12, color: C.muted, lineHeight: 1.8 }}>
            RELIANCE operates across energy, petrochemicals, telecom (Jio) and retail. It is India's largest company by market capitalization and revenue.
          </div>
          <div>
            <div style={{ fontFamily: sans, fontSize: 10, color: C.muted, marginBottom: 8 }}>Shareholding Pattern</div>
            {d.overview.shareholding.map(([k, v]) => (
              <div key={k} style={{ marginBottom: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontFamily: sans, fontSize: 11, color: C.text }}>{k}</span>
                  <span style={{ fontFamily: mono, fontSize: 11, color: C.cyan }}>{v}%</span>
                </div>
                <Bar val={v} max={60} color={C.cyan} />
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "financials" && (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: 10 }}>
          {[["P/E Ratio", d.overview.pe], ["EPS", `₹${d.overview.eps}`], ["Revenue", d.overview.rev], ["Profit Growth", d.overview.profitGrowth], ["Total Debt", d.overview.debt], ["Market Cap", d.overview.mc]].map(([l, v]) => (
            <div key={l} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: "10px 12px" }}>
              <div style={{ fontFamily: sans, fontSize: 9, color: C.muted, marginBottom: 4 }}>{l}</div>
              <div style={{ fontFamily: mono, fontSize: 14, fontWeight: 800, color: C.text }}>{v}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "quarterly" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {d.quarterly.map((q, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: "10px 14px", flexWrap: "wrap", gap: 6 }}>
              <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.text, width: 80 }}>{q.q}</span>
              <span style={{ fontFamily: sans, fontSize: 11, color: C.muted }}>Rev: <b style={{ color: C.text, fontFamily: mono }}>{q.rev}</b></span>
              <span style={{ fontFamily: sans, fontSize: 11, color: C.muted }}>Profit: <b style={{ color: C.text, fontFamily: mono }}>{q.profit}</b></span>
              <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 800, color: C.green }}>{q.growth}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "management" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {d.management.map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: "10px 14px" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.cyanDim, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, fontSize: 13, fontWeight: 800, color: C.cyan, flexShrink: 0 }}>{m.name[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 600, color: C.text }}>{m.name}</div>
                <div style={{ fontFamily: sans, fontSize: 10, color: C.muted }}>{m.role}</div>
              </div>
              <span style={{ fontFamily: mono, fontSize: 10, color: C.muted }}>{m.tenure}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "competitors" && (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
          {d.competitors.map((c, i) => (
            <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: 12 }}>
              <div style={{ fontFamily: mono, fontSize: 13, fontWeight: 800, color: C.text, marginBottom: 6 }}>{c.sym}</div>
              <div style={{ fontFamily: sans, fontSize: 10, color: C.muted }}>Mkt Cap: <span style={{ fontFamily: mono, color: C.text }}>{c.mc}</span></div>
              <div style={{ fontFamily: sans, fontSize: 10, color: C.muted }}>P/E: <span style={{ fontFamily: mono, color: C.text }}>{c.pe}</span></div>
            </div>
          ))}
        </div>
      )}

      {tab === "news" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {NEWS.filter(n => n.stocks.includes("RELIANCE")).map((n, i) => (
            <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: 12 }}>
              <div style={{ fontFamily: sans, fontSize: 11, color: C.text, marginBottom: 5 }}>{n.title}</div>
              <Badge t={n.sent} />
            </div>
          ))}
        </div>
      )}

      {tab === "historical" && (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(5, 1fr)", gap: 8 }}>
          {d.historical.map(([y, r]) => (
            <div key={y} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontFamily: sans, fontSize: 10, color: C.muted, marginBottom: 4 }}>{y}</div>
              <div style={{ fontFamily: mono, fontSize: 13, fontWeight: 800, color: r.startsWith("+") ? C.green : C.red }}>{r}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "risks" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {d.risks.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: C.redDim, border: `1px solid ${C.red}22`, borderRadius: 7, padding: "10px 12px" }}>
              <span style={{ color: C.red, fontSize: 12 }}>⚠</span>
              <span style={{ fontFamily: sans, fontSize: 11, color: C.text, lineHeight: 1.6 }}>{r}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function AIPage({ isMobile }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [modalSym, setModalSym] = useState<string | null>(null);
  const toggle = sym => setExpanded(e => ({ ...e, [sym]: !e[sym] }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10 }}>
        <Stat label="Active Signals" value="4" color={C.cyan} sub="2 BUY · 1 SELL · 1 WATCH" />
        <Stat label="Avg Confidence" value="75.8%" color={C.purple} />
        <Stat label="Win Rate" value="68.4%" color={C.green} sub="Last 30 days" />
        <Stat label="Accuracy" value="71.2%" color={C.amber} sub="Historical backtest" />
      </div>

      {AI_SIGNALS.map((s, i) => {
        const extra = AI_REASONS[s.sym];
        const isOpen = expanded[s.sym];
        return (
          <Card key={i} style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontFamily: mono, fontSize: 16, fontWeight: 800, color: C.text }}>{s.sym}</span>
                <Badge t={s.type} /><Badge t={s.risk} />
              </div>
              <span style={{ fontFamily: mono, fontSize: 11, color: C.muted }}>{s.tf} · {s.pattern}</span>
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: isMobile ? "wrap" : "nowrap" }}>
              <div style={{ display: "flex", gap: 10 }}>
                <Ring val={s.conf} color={C.cyan} size={64} label="Confidence" />
                <Ring val={s.profit} color={C.green} size={64} label="Profit Prob" />
                <Ring val={100 - s.profit} color={C.red} size={64} label="Loss Prob" />
              </div>
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[["Entry Price", `₹${s.entry.toLocaleString()}`, C.text], ["Target Price", `₹${s.target.toLocaleString()}`, C.green], ["Stop Loss", `₹${s.sl.toLocaleString()}`, C.red], ["Expected Return", s.ret, C.cyan], ["Risk Level", s.risk, s.risk === "LOW" ? C.green : s.risk === "MED" ? C.amber : C.red], ["Timeframe", s.tf, C.text]].map(([l, v, col]) => (
                  <div key={l} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: "8px 12px" }}>
                    <div style={{ fontFamily: sans, fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{l}</div>
                    <div style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: col }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {extra && (
              <>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button onClick={() => toggle(s.sym)} style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, color: C.cyan, fontFamily: sans, fontSize: 11, fontWeight: 600, padding: "8px 0", borderRadius: 7 }}>
                    {isOpen ? "▲ Hide reasons" : "▼ Why this recommendation?"}
                  </button>
                  <button onClick={() => setModalSym(s.sym)} style={{ background: C.purpleDim, border: `1px solid ${C.purple}33`, color: C.purple, fontFamily: sans, fontSize: 11, fontWeight: 600, padding: "8px 14px", borderRadius: 7, whiteSpace: "nowrap" }}>
                    ◆ AI Explanation
                  </button>
                </div>

                {isOpen && (
                  <div style={{ marginTop: 12, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
                      <div><div style={{ fontFamily: sans, fontSize: 9, color: C.muted, marginBottom: 3 }}>Suggested Entry Zone</div><div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.text }}>₹{extra.entryZone}</div></div>
                      <div><div style={{ fontFamily: sans, fontSize: 9, color: C.muted, marginBottom: 3 }}>Risk / Reward Ratio</div><div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.cyan }}>{extra.rr}</div></div>
                      <div><div style={{ fontFamily: sans, fontSize: 9, color: C.muted, marginBottom: 3 }}>Target / Stop</div><div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.text }}>₹{extra.target} / ₹{extra.sl}</div></div>
                    </div>
                    <div style={{ fontFamily: sans, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Recommendation Reasons</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {extra.reasons.map((r, j) => (
                        <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <span style={{ color: r.ok ? C.green : C.amber, fontSize: 12, flexShrink: 0 }}>{r.ok ? "✓" : "⚠"}</span>
                          <span style={{ fontFamily: sans, fontSize: 11, color: C.text, lineHeight: 1.6 }}>{r.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        );
      })}

      <Modal open={!!modalSym} onClose={() => setModalSym(null)} title={`AI Explanation — ${modalSym}`}>
        {modalSym && AI_REASONS[modalSym] && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontFamily: sans, fontSize: 12, color: C.text, lineHeight: 1.8 }}>{AI_REASONS[modalSym].explain}</div>
            <div>
              <div style={{ fontFamily: sans, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Supporting Indicators</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {AI_REASONS[modalSym].reasons.map((r, j) => (
                  <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ color: r.ok ? C.green : C.amber, fontSize: 12, flexShrink: 0 }}>{r.ok ? "✓" : "⚠"}</span>
                    <span style={{ fontFamily: sans, fontSize: 11, color: C.text, lineHeight: 1.6 }}>{r.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: C.amberDim, border: `1px solid ${C.amber}33`, borderRadius: 7, padding: 10, fontFamily: sans, fontSize: 10, color: C.amber, lineHeight: 1.6 }}>
              ⚠ This is a probabilistic AI estimate, not a guarantee. Markets carry risk — always size positions responsibly.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function NewsPage({ isMobile }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10 }}>
        <Stat label="Total Today" value="47" sub="News articles scanned" color={C.cyan} />
        <Stat label="Positive" value="22" color={C.green} sub="46.8% of news" />
        <Stat label="Negative" value="14" color={C.red} sub="29.8% of news" />
        <Stat label="Market Mood" value="54.2" sub="Slightly Bullish" color={C.amber} />
      </div>

      {/* Sentiment Dashboard */}
      <Card style={{ padding: 16 }}>
        <SecHead title="News Sentiment Dashboard" sub="Aggregate breakdown of today's coverage" />
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ width: "46.8%", background: C.green }} />
            <div style={{ width: "23.4%", background: C.amber }} />
            <div style={{ width: "29.8%", background: C.red }} />
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontFamily: sans, fontSize: 11, color: C.muted }}><span style={{ color: C.green }}>●</span> Positive — 22</span>
            <span style={{ fontFamily: sans, fontSize: 11, color: C.muted }}><span style={{ color: C.amber }}>●</span> Neutral — 11</span>
            <span style={{ fontFamily: sans, fontSize: 11, color: C.muted }}><span style={{ color: C.red }}>●</span> Negative — 14</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
          <div>
            <div style={{ fontFamily: sans, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>News Timeline & Price Impact</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {NEWS_TIMELINE.map((e, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "7px 10px" }}>
                  <span style={{ fontFamily: mono, fontSize: 10, color: C.muted, width: 38, flexShrink: 0 }}>{e.time}</span>
                  <span style={{ fontFamily: sans, fontSize: 10, color: C.text, flex: 1 }}>{e.event}</span>
                  <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, color: e.impact.startsWith("+") ? C.green : e.impact.startsWith("-") ? C.red : C.muted }}>{e.impact}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: sans, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Top News Sources</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[["Economic Times", 14], ["Bloomberg", 9], ["Mint", 8], ["CNBC TV18", 7], ["Business Standard", 5]].map(([s, c]) => (
                <div key={s} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "7px 10px" }}>
                  <span style={{ fontFamily: sans, fontSize: 11, color: C.text }}>{s}</span>
                  <span style={{ fontFamily: mono, fontSize: 11, color: C.cyan }}>{c} articles</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card style={{ padding: 16 }}>
        <SecHead title="News Feed & Sentiment Analysis" sub="AI-scored — updated every 15 minutes" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {NEWS.map((n, i) => (
            <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 50, height: 50, borderRadius: 8, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: n.sent === "POSITIVE" ? C.greenDim : n.sent === "NEGATIVE" ? C.redDim : C.amberDim }}>
                  <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 800, color: n.sent === "POSITIVE" ? C.green : n.sent === "NEGATIVE" ? C.red : C.amber }}>{n.score > 0 ? "+" : ""}{n.score.toFixed(2)}</span>
                  <span style={{ fontFamily: sans, fontSize: 9, color: C.muted }}>AI score</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: sans, fontSize: 12, color: C.text, lineHeight: 1.6, marginBottom: 6 }}>{n.title}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: sans, fontSize: 10, color: C.muted }}>{n.src} · {n.time} ago</span>
                    <Badge t={n.sent} />
                    {n.stocks.map(s => <span key={s} style={{ fontFamily: mono, fontSize: 9, color: C.cyan, background: C.cyanDim, padding: "1px 6px", borderRadius: 3 }}>{s}</span>)}
                  </div>
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontFamily: sans, fontSize: 10, color: C.muted }}>Sentiment strength</span>
                  <span style={{ fontFamily: mono, fontSize: 10, color: n.sent === "POSITIVE" ? C.green : n.sent === "NEGATIVE" ? C.red : C.amber }}>{Math.abs(n.score * 100).toFixed(0)}%</span>
                </div>
                <Bar val={Math.abs(n.score * 100)} max={100} color={n.sent === "POSITIVE" ? C.green : n.sent === "NEGATIVE" ? C.red : C.amber} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function TradesPage({ isMobile }) {
  const wins = TRADE_HISTORY.filter(t => t.pnl > 0 && t.status === "CLOSED").length;
  const total = TRADE_HISTORY.filter(t => t.status === "CLOSED").length;
  const totalPnl = TRADE_HISTORY.reduce((s, t) => s + t.pnl, 0);
  const cols = isMobile ? "1fr 1fr" : "repeat(4, 1fr)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 10 }}>
        <Stat label="Total P&L" value={`${totalPnl > 0 ? "+" : ""}₹${Math.abs(totalPnl).toLocaleString()}`} color={totalPnl > 0 ? C.green : C.red} />
        <Stat label="Win Rate" value={`${((wins / total) * 100).toFixed(0)}%`} color={C.cyan} sub={`${wins} wins of ${total} closed`} />
        <Stat label="Best Trade" value="+₹1,016" color={C.green} sub="BAJAJ FIN · +3.64%" />
        <Stat label="Worst Trade" value="-₹1,500" color={C.red} sub="INFY · -3.3%" />
      </div>
      <Card style={{ padding: 16 }}>
        <SecHead title="Trade History" sub="All executed trades — last 30 days" />
        {isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {TRADE_HISTORY.map((t, i) => (
              <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 800, color: C.text }}>{t.sym}</span>
                    <Badge t={t.type} /><Badge t={t.status} />
                  </div>
                  <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 800, color: t.pnl >= 0 ? C.green : C.red }}>{t.pnl >= 0 ? "+" : ""}₹{Math.abs(t.pnl)}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 4 }}>
                  {[["Qty", t.qty], ["Entry", `₹${t.entry}`], ["Exit", t.exit ? `₹${t.exit}` : "Open"], ["Return", `${t.pnlPct >= 0 ? "+" : ""}${t.pnlPct}%`]].map(([l, v]) => (
                    <div key={l}><div style={{ fontFamily: sans, fontSize: 9, color: C.muted }}>{l}</div><div style={{ fontFamily: mono, fontSize: 11, color: l === "Return" ? (t.pnlPct >= 0 ? C.green : C.red) : C.text }}>{v}</div></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>{["Symbol", "Type", "Status", "Qty", "Entry", "Exit", "P&L", "Return", "Date"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontFamily: sans, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 1, borderBottom: `1px solid ${C.border}`, fontWeight: 600 }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {TRADE_HISTORY.map((t, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}22` }}>
                    <td style={{ padding: "10px 12px" }}><span style={{ fontFamily: mono, fontSize: 13, fontWeight: 800, color: C.text }}>{t.sym}</span></td>
                    <td style={{ padding: "10px 12px" }}><Badge t={t.type} /></td>
                    <td style={{ padding: "10px 12px" }}><Badge t={t.status} /></td>
                    <td style={{ padding: "10px 12px" }}><span style={{ fontFamily: mono, fontSize: 12, color: C.text }}>{t.qty}</span></td>
                    <td style={{ padding: "10px 12px" }}><span style={{ fontFamily: mono, fontSize: 12, color: C.muted }}>₹{t.entry}</span></td>
                    <td style={{ padding: "10px 12px" }}><span style={{ fontFamily: mono, fontSize: 12, color: C.muted }}>{t.exit ? `₹${t.exit}` : "—"}</span></td>
                    <td style={{ padding: "10px 12px" }}><span style={{ fontFamily: mono, fontSize: 13, fontWeight: 800, color: t.pnl >= 0 ? C.green : C.red }}>{t.pnl >= 0 ? "+" : ""}₹{Math.abs(t.pnl)}</span></td>
                    <td style={{ padding: "10px 12px" }}><span style={{ fontFamily: mono, fontSize: 12, color: t.pnlPct >= 0 ? C.green : C.red }}>{t.pnlPct >= 0 ? "+" : ""}{t.pnlPct}%</span></td>
                    <td style={{ padding: "10px 12px" }}><span style={{ fontFamily: sans, fontSize: 11, color: C.muted }}>{t.date}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Trading Analytics */}
      <Card style={{ padding: 16 }}>
        <SecHead title="Trading Performance Analytics" sub="AI-derived insights from your trade history" />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
          {[["Avg Profit / Win", "₹820", C.green], ["Avg Loss / Loss", "₹1,500", C.red], ["Best Sector", "Finance (+3.6%)", C.green], ["Worst Sector", "IT (-1.3%)", C.red]].map(([l, v, col]) => (
            <div key={l} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: "10px 12px" }}>
              <div style={{ fontFamily: sans, fontSize: 9, color: C.muted, marginBottom: 4 }}>{l}</div>
              <div style={{ fontFamily: mono, fontSize: 13, fontWeight: 800, color: col }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Trading Calendar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: sans, fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Trading Calendar — Last 14 Days</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
            {Array.from({ length: 14 }, (_, i) => {
              const v = Math.round((Math.sin(i * 1.3) + Math.cos(i * 0.7)) * 600);
              const col = v > 200 ? C.green : v < -200 ? C.red : C.dim;
              return (
                <div key={i} style={{ background: col === C.dim ? C.bg : `${col}22`, border: `1px solid ${col}55`, borderRadius: 6, padding: "8px 4px", textAlign: "center" }}>
                  <div style={{ fontFamily: sans, fontSize: 8, color: C.muted }}>Day {i + 1}</div>
                  <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, color: v === 0 ? C.muted : col }}>{v > 0 ? "+" : ""}{v !== 0 ? `₹${Math.abs(v)}` : "—"}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most profitable strategy + AI suggestions */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 }}>
            <div style={{ fontFamily: sans, fontSize: 11, color: C.muted, marginBottom: 6 }}>Most Profitable Strategy</div>
            <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 4 }}>Breakout entries on Financial Services stocks</div>
            <div style={{ fontFamily: sans, fontSize: 11, color: C.muted, lineHeight: 1.6 }}>4 of 5 trades in this category closed profitably, averaging +3.1% return.</div>
          </div>
          <div style={{ background: C.redDim, border: `1px solid ${C.red}33`, borderRadius: 8, padding: 14 }}>
            <div style={{ fontFamily: sans, fontSize: 11, color: C.muted, marginBottom: 6 }}>Biggest Mistake Pattern</div>
            <div style={{ fontFamily: sans, fontSize: 13, fontWeight: 700, color: C.red, marginBottom: 4 }}>Holding IT stocks through earnings season</div>
            <div style={{ fontFamily: sans, fontSize: 11, color: C.muted, lineHeight: 1.6 }}>The INFY trade lost 3.3% after holding through a sector-wide sentiment dip. Consider tighter stops around earnings dates.</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function AlertsPage({ isMobile }) {
  const [alerts, setAlerts] = useState(ALERTS_DATA);
  const unread = alerts.filter(a => !a.read).length;
  const mark = useCallback(() => setAlerts(a => a.map(x => ({ ...x, read: true }))), []);
  const typeCol = { AI: C.purple, PRICE: C.cyan, NEWS: C.amber, TRADE: C.red, GOAL: C.green, RISK: C.red };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10 }}>
        <Stat label="Unread Alerts" value={unread.toString()} color={unread > 0 ? C.red : C.green} />
        <Stat label="Today's Triggers" value="6" color={C.amber} />
        <Stat label="AI Signals" value="2" color={C.purple} />
        <Stat label="Risk Alerts" value="1" color={C.red} />
      </div>
      <Card style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <SecHead title="Alert Centre" sub="Real-time monitoring" />
          <button onClick={mark} style={{ background: C.cyanDim, border: `1px solid ${C.cyan}33`, color: C.cyan, fontFamily: sans, fontSize: 11, padding: "5px 12px", borderRadius: 6, cursor: "pointer" }}>Mark all read</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {alerts.map((a, i) => (
            <div key={i} onClick={() => setAlerts(al => al.map((x, j) => j === i ? { ...x, read: true } : x))} style={{
              display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", cursor: "pointer",
              background: a.read ? C.bg : `${typeCol[a.type]}08`,
              border: `1px solid ${a.read ? C.border : typeCol[a.type] + "44"}`,
              borderRadius: 8, opacity: a.read ? 0.6 : 1
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.read ? "transparent" : typeCol[a.type], flexShrink: 0 }} />
              <div style={{ width: 44, textAlign: "center", background: `${typeCol[a.type]}22`, borderRadius: 4, padding: "3px 0", fontFamily: mono, fontSize: 9, color: typeCol[a.type], fontWeight: 800, letterSpacing: 0.5, flexShrink: 0 }}>{a.type}</div>
              <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 800, color: C.cyan, width: 70, flexShrink: 0 }}>{a.sym}</div>
              <div style={{ flex: 1, fontFamily: sans, fontSize: 11, color: C.text, lineHeight: 1.5, minWidth: 0 }}>{a.msg}</div>
              <Badge t={a.sev} />
              <span style={{ fontFamily: mono, fontSize: 10, color: C.muted, flexShrink: 0 }}>{a.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function RiskPage({ isMobile }) {
  const cols = isMobile ? "1fr 1fr" : "repeat(4, 1fr)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 10 }}>
        <Stat label="Portfolio Risk" value="MED" color={C.amber} sub="Moderate volatility" />
        <Stat label="Risk Score" value="42/100" color={C.amber} sub="Lower is safer" />
        <Stat label="Max Drawdown" value="-8.4%" color={C.red} sub="Last 30 days" />
        <Stat label="Sharpe Ratio" value="1.42" color={C.green} sub="Good risk/return" />
      </div>
      <Card style={{ padding: 16 }}>
        <SecHead title="Risk Breakdown by Stock" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PORTFOLIO.map((s, i) => {
            const risk = Math.abs(s.chg) > 2 ? "HIGH" : Math.abs(s.chg) > 1 ? "MED" : "LOW";
            const rCol = risk === "HIGH" ? C.red : risk === "MED" ? C.amber : C.green;
            return (
              <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 800, color: C.text, width: 100 }}>{s.sym}</span>
                <Badge t={risk} />
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontFamily: sans, fontSize: 10, color: C.muted }}>Volatility</span>
                    <span style={{ fontFamily: mono, fontSize: 10, color: rCol }}>{Math.abs(s.chg)}%</span>
                  </div>
                  <Bar val={Math.abs(s.chg)} max={5} color={rCol} />
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: sans, fontSize: 9, color: C.muted }}>Exposure</div>
                  <div style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.text }}>₹{((s.qty * s.ltp) / 1000).toFixed(1)}K</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      <Card style={{ padding: 16 }}>
        <SecHead title="Risk Management Rules" sub="Active position limits" />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
          {[{ rule: "Max position size", val: "20%", status: "OK", col: C.green }, { rule: "Max sector exposure", val: "40%", status: "BREACHED", col: C.red }, { rule: "Stop-loss enforced", val: "All trades", status: "OK", col: C.green }, { rule: "Daily loss limit", val: "₹10,000", status: "OK", col: C.green }, { rule: "Leverage used", val: "0× (No leverage)", status: "OK", col: C.green }, { rule: "Portfolio beta", val: "1.24 (Moderate)", status: "WATCH", col: C.amber }].map((r, i) => (
            <div key={i} style={{ background: C.bg, border: `1px solid ${r.col}33`, borderRadius: 8, padding: 14 }}>
              <div style={{ fontFamily: sans, fontSize: 11, color: C.muted, marginBottom: 6 }}>{r.rule}</div>
              <div style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>{r.val}</div>
              <Badge t={r.status === "OK" ? "LOW" : r.status === "BREACHED" ? "HIGH" : "MED"} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SettingsPage({ isMobile }) {
  const [notif, setNotif] = useState({ price: true, ai: true, news: false, risk: true });
  const [theme, setTheme] = useState("dark");
  const [refresh, setRefresh] = useState("10");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ padding: 16 }}>
        <SecHead title="Profile" />
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.cyanDim, border: `2px solid ${C.cyan}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, fontSize: 22, fontWeight: 800, color: C.cyan }}>J</div>
          <div>
            <div style={{ fontFamily: sans, fontSize: 15, fontWeight: 700, color: C.text }}>Jagadeesh</div>
            <div style={{ fontFamily: sans, fontSize: 12, color: C.muted }}>B.Tech CSE (AI&ML) · JNTU Kakinada</div>
            <div style={{ fontFamily: mono, fontSize: 11, color: C.cyan, marginTop: 2 }}>Joined Jun 2025</div>
          </div>
        </div>
      </Card>
      <Card style={{ padding: 16 }}>
        <SecHead title="Notifications" sub="Choose what alerts you receive" />
        {[["price", "Price Alerts", "Get notified when stocks hit your target prices"], ["ai", "AI Signals", "New trade signals from the prediction engine"], ["news", "News Alerts", "Breaking market news and sentiment changes"], ["risk", "Risk Warnings", "Portfolio risk threshold breaches"]].map(([k, label, desc]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.border}` }}>
            <div>
              <div style={{ fontFamily: sans, fontSize: 12, fontWeight: 600, color: C.text }}>{label}</div>
              <div style={{ fontFamily: sans, fontSize: 11, color: C.muted, marginTop: 2 }}>{desc}</div>
            </div>
            <div onClick={() => setNotif(n => ({ ...n, [k]: !n[k] }))} style={{ width: 42, height: 24, borderRadius: 12, background: notif[k] ? C.green : C.dim, cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.text, position: "absolute", top: 3, left: notif[k] ? 21 : 3, transition: "left 0.2s" }} />
            </div>
          </div>
        ))}
      </Card>
      <Card style={{ padding: 16 }}>
        <SecHead title="Data & Display" />
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: sans, fontSize: 12, color: C.muted, marginBottom: 8 }}>Auto-refresh interval</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["5", "10", "15", "30"].map(v => (
              <button key={v} onClick={() => setRefresh(v)} style={{ background: refresh === v ? C.cyan : C.bg, border: `1px solid ${refresh === v ? C.cyan : C.border}`, color: refresh === v ? C.bg : C.muted, fontFamily: mono, fontSize: 11, padding: "6px 14px", borderRadius: 6, cursor: "pointer" }}>{v}m</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: sans, fontSize: 12, color: C.muted, marginBottom: 8 }}>Theme</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["dark", "darker"].map(t => (
              <button key={t} onClick={() => setTheme(t)} style={{ background: theme === t ? C.cyan : C.bg, border: `1px solid ${theme === t ? C.cyan : C.border}`, color: theme === t ? C.bg : C.muted, fontFamily: mono, fontSize: 11, padding: "6px 14px", borderRadius: 6, cursor: "pointer", textTransform: "capitalize" }}>{t}</button>
            ))}
          </div>
        </div>
      </Card>
      <Card style={{ padding: 16 }}>
        <SecHead title="Disclaimer" />
        <div style={{ fontFamily: sans, fontSize: 11, color: C.muted, lineHeight: 1.8, background: C.amberDim, border: `1px solid ${C.amber}33`, borderRadius: 8, padding: 14 }}>
          FinPilot AI provides intelligent recommendations, probability estimates, and risk analysis to help inform your decisions. It does not guarantee profits or predict exact market movements. All AI signals are probabilistic in nature. Past performance is not indicative of future results. This is not SEBI-registered investment advice. Always do your own research before investing.
        </div>
      </Card>
    </div>
  );
}

// ─── SHELL ────────────────────────────────────────────────────────────────────
export default function App() {
  const { isMobile, isTablet } = useResponsive();
  const [page, setPage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const compact = isMobile || isTablet;

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const PAGES = { home: Dashboard, finance: FinancePage, portfolio: PortfolioPage, screener: ScreenerPage, research: ResearchPageBase, charts: ChartsPage, ai: AIPage, predict: PredictPage, watchlist: WatchlistPage, news: NewsPage, trades: TradesPage, alerts: AlertsPage, risk: RiskPage, settings: SettingsPage };
  const PageComp = PAGES[page] || Dashboard;
  const pageLabel = NAV.find(n => n.id === page)?.label || "Dashboard";
  const unreadAlerts = ALERTS_DATA.filter(a => !a.read).length;

  // Mobile bottom nav shows 5 most important items
  const bottomNav = [
    NAV.find(n => n.id === "home"),
    NAV.find(n => n.id === "portfolio"),
    NAV.find(n => n.id === "charts"),
    NAV.find(n => n.id === "ai"),
    NAV.find(n => n.id === "alerts"),
  ];

  return (
    <div style={{ fontFamily: sans, background: C.bg, minHeight: "100vh", color: C.text, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
        button{cursor:pointer;transition:opacity 0.15s}
        button:hover{opacity:0.85}
        button:active{opacity:0.7}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
      `}</style>

      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${isMobile ? 12 : 20}px`, height: 48, background: "#050A12", borderBottom: `1px solid ${C.border}`, flexShrink: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {compact && (
            <button onClick={() => setSidebarOpen(o => !o)} style={{ background: "transparent", border: "none", color: C.muted, fontSize: 18, padding: "4px 8px", borderRadius: 6 }}>☰</button>
          )}
          <div style={{ fontFamily: mono, fontSize: isMobile ? 14 : 16, fontWeight: 800, color: C.cyan, letterSpacing: 1 }}>
            FIN<span style={{ color: C.text }}>PILOT</span><span style={{ color: C.green, fontSize: 9, marginLeft: 3, verticalAlign: "super" }}>AI</span>
          </div>
          {!isMobile && (
            <>
              <div style={{ width: 1, height: 16, background: C.border }} />
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, boxShadow: `0 0 6px ${C.green}`, animation: "blink 2s infinite" }} />
              <span style={{ fontFamily: mono, fontSize: 10, color: C.green }}>LIVE · NSE</span>
            </>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 16 }}>
          {!isMobile && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.text }}>{time.toLocaleTimeString("en-IN", { hour12: false })}</div>
              <div style={{ fontFamily: sans, fontSize: 9, color: C.muted }}>IST</div>
            </div>
          )}
          <div onClick={() => setPage("alerts")} style={{ position: "relative", cursor: "pointer" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.amberDim, border: `1px solid ${C.amber}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>◬</div>
            {unreadAlerts > 0 && <div style={{ position: "absolute", top: -2, right: -2, width: 14, height: 14, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, fontSize: 8, fontWeight: 800, color: "#fff" }}>{unreadAlerts}</div>}
          </div>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.cyanDim, border: `2px solid ${C.cyan}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, fontSize: 13, fontWeight: 800, color: C.cyan }}>J</div>
        </div>
      </header>

      {/* Ticker */}
      <Ticker />

      {/* Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>

        {/* Mobile sidebar overlay */}
        {compact && sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "#00000088", zIndex: 200 }} />
        )}

        {/* Sidebar */}
        {(!compact || sidebarOpen) && (
          <nav style={{
            width: compact ? 220 : 196, background: "#050A12", borderRight: `1px solid ${C.border}`,
            display: "flex", flexDirection: "column", padding: "10px 0", flexShrink: 0, overflowY: "auto",
            position: compact ? "fixed" : "relative", top: compact ? 0 : undefined, left: compact ? 0 : undefined,
            bottom: compact ? 0 : undefined, zIndex: compact ? 300 : undefined, paddingTop: compact ? 56 : 10
          }}>
            {NAV.map(item => {
              const isActive = page === item.id;
              return (
                <button key={item.id} onClick={() => { setPage(item.id); setSidebarOpen(false); }} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "11px 16px",
                  background: isActive ? C.cyanDim : "transparent", border: "none",
                  borderLeft: `3px solid ${isActive ? C.cyan : "transparent"}`,
                  color: isActive ? C.cyan : C.muted, width: "100%", textAlign: "left",
                }}>
                  <span style={{ fontFamily: mono, fontSize: 13 }}>{item.icon}</span>
                  <span style={{ fontFamily: sans, fontSize: 12, fontWeight: isActive ? 700 : 400 }}>{item.label}</span>
                  {item.id === "alerts" && unreadAlerts > 0 && (
                    <span style={{ marginLeft: "auto", background: C.red, color: "#fff", fontFamily: mono, fontSize: 9, fontWeight: 800, padding: "1px 5px", borderRadius: 10 }}>{unreadAlerts}</span>
                  )}
                </button>
              );
            })}
            <div style={{ flex: 1 }} />
            <div style={{ margin: "10px 10px 16px", padding: "10px 12px", background: C.amberDim, border: `1px solid ${C.amber}33`, borderRadius: 8, fontFamily: sans, fontSize: 10, color: C.amber, lineHeight: 1.6 }}>
              ⚠ AI signals are probabilistic estimates, not financial advice.
            </div>
          </nav>
        )}

        {/* Main */}
        <main style={{ flex: 1, overflowY: "auto", padding: isMobile ? "14px 12px 80px" : "18px 22px 24px", minWidth: 0 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: sans, fontSize: isMobile ? 15 : 17, fontWeight: 800, color: C.text }}>{pageLabel}</div>
            <div style={{ fontFamily: mono, fontSize: 10, color: C.muted, marginTop: 2 }}>{time.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
          </div>
          <PageComp isMobile={isMobile} />
          <div style={{ height: 20 }} />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      {isMobile && (
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 60, background: "#050A12", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-around", zIndex: 100, paddingBottom: 4 }}>
          {bottomNav.map(item => {
            const isActive = page === item.id;
            return (
              <button key={item.id} onClick={() => setPage(item.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "transparent", border: "none", color: isActive ? C.cyan : C.muted, padding: "6px 12px", position: "relative" }}>
                <span style={{ fontFamily: mono, fontSize: 16 }}>{item.icon}</span>
                <span style={{ fontFamily: sans, fontSize: 9, fontWeight: isActive ? 700 : 400 }}>{item.label}</span>
                {item.id === "alerts" && unreadAlerts > 0 && <div style={{ position: "absolute", top: 4, right: 8, width: 12, height: 12, borderRadius: "50%", background: C.red, fontFamily: mono, fontSize: 7, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{unreadAlerts}</div>}
              </button>
            );
          })}
          <button onClick={() => setSidebarOpen(true)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "transparent", border: "none", color: C.muted, padding: "6px 12px" }}>
            <span style={{ fontFamily: mono, fontSize: 16 }}>⋯</span>
            <span style={{ fontFamily: sans, fontSize: 9 }}>More</span>
          </button>
        </nav>
      )}
    </div>
  );
}
