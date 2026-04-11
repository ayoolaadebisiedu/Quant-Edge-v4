/**
 * Shared market data and types for the QuantEdge terminal.
 */

export interface MarketItem {
  symbol: string;
  price: number;
  change: number;
  volume: string;
  rsi: number;
  status: string;
  market: 'crypto' | 'forex' | 'stocks' | 'commodities';
  isFavorite?: boolean;
  rvol: number;
  volatility: number;
  sentiment: number;
  pattern?: string;
  peRatio?: number;
  fundingRate?: string;
  pipValue?: string;
}

export const INITIAL_MARKET_DATA: MarketItem[] = [
  { symbol: 'BTC/USDT', price: 64231.50, change: 4.2, volume: '2.4B', rsi: 65, status: 'Bullish', market: 'crypto', rvol: 1.2, volatility: 0.8, sentiment: 0.85, pattern: 'Cup & Handle', fundingRate: '0.01%' },
  { symbol: 'ETH/USDT', price: 3421.20, change: 2.1, volume: '1.1B', rsi: 58, status: 'Neutral', market: 'crypto', rvol: 0.9, volatility: 1.2, sentiment: 0.4, fundingRate: '0.008%' },
  { symbol: 'SOL/USDT', price: 142.55, change: -1.8, volume: '800M', rsi: 42, status: 'Bearish', market: 'crypto', rvol: 1.5, volatility: 2.1, sentiment: -0.2, pattern: 'Double Top', fundingRate: '0.015%' },
  { symbol: 'NVDA', price: 875.22, change: 6.8, volume: '45M', rsi: 78, status: 'Overbought', market: 'stocks', rvol: 2.4, volatility: 1.5, sentiment: 0.95, pattern: 'Breakout', peRatio: 72.4 },
  { symbol: 'AAPL', price: 182.41, change: 1.2, volume: '54M', rsi: 62, status: 'Bullish', market: 'stocks', rvol: 0.8, volatility: 0.4, sentiment: 0.6, peRatio: 28.1 },
  { symbol: 'TSLA', price: 175.05, change: -3.5, volume: '82M', rsi: 29, status: 'Oversold', market: 'stocks', rvol: 1.9, volatility: 2.5, sentiment: -0.8, pattern: 'Falling Wedge', peRatio: 41.2 },
  { symbol: 'EUR/USD', price: 1.0845, change: 0.15, volume: '4.2T', rsi: 51, status: 'Neutral', market: 'forex', rvol: 0.7, volatility: 0.2, sentiment: 0.1, pipValue: '10.00' },
  { symbol: 'GBP/JPY', price: 191.22, change: -0.42, volume: '1.8T', rsi: 38, status: 'Bearish', market: 'forex', rvol: 1.1, volatility: 0.9, sentiment: -0.3, pipValue: '6.50' },
  { symbol: 'GOLD (XAU)', price: 2342.10, change: 0.85, volume: '420B', rsi: 68, status: 'Bullish', market: 'commodities', rvol: 1.3, volatility: 0.5, sentiment: 0.7, pattern: 'Ascending Triangle' },
  { symbol: 'CRUDE OIL', price: 82.45, change: -1.2, volume: '180B', rsi: 44, status: 'Neutral', market: 'commodities', rvol: 0.9, volatility: 1.8, sentiment: -0.1 }
];
