
"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Wallet, Target, Zap, Activity } from "lucide-react"
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts'

const performanceData = [
  { time: '09:00', value: 45200 },
  { time: '10:00', value: 45800 },
  { time: '11:00', value: 45600 },
  { time: '12:00', value: 46200 },
  { time: '13:00', value: 47100 },
  { time: '14:00', value: 46800 },
  { time: '15:00', value: 47500 },
]

const topMovers = [
  { symbol: 'BTC/USDT', price: '64,231.50', change: '+4.2%', up: true },
  { symbol: 'ETH/USDT', price: '3,421.20', change: '+2.1%', up: true },
  { symbol: 'SOL/USDT', price: '142.55', change: '-1.8%', up: false },
  { symbol: 'AVAX/USDT', price: '38.12', change: '+6.5%', up: true },
  { symbol: 'DOT/USDT', price: '7.45', change: '-3.2%', up: false },
]

export default function DashboardPage() {
  return (
    <div className="flex-1 flex flex-col overflow-auto p-6 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trading Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Strategist. Your portfolio is up 2.4% today.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="px-3 py-1">Market: OPEN</Badge>
          <Badge variant="secondary" className="px-3 py-1">Paper Trading</Badge>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Net Asset Value</CardTitle>
            <Wallet className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$47,502.12</div>
            <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +$1,120.45 (2.41%)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Strategies</CardTitle>
            <Zap className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">
              3 Profitable / 1 Drawdown
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">64.2%</div>
            <div className="w-full bg-muted rounded-full h-1.5 mt-3">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: '64.2%' }}></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Daily Orders</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg Fill Time: 12ms
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Equity Curve</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#235299" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#235299" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2e2e2e" />
                <XAxis dataKey="time" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1E22', border: '1px solid #2e2e2e' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#235299" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Movers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topMovers.map((mover) => (
              <div key={mover.symbol} className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{mover.symbol}</div>
                  <div className="text-sm text-muted-foreground">${mover.price}</div>
                </div>
                <Badge variant={mover.up ? "default" : "destructive"} className={mover.up ? "bg-green-500/20 text-green-500 hover:bg-green-500/30" : "bg-red-500/20 text-red-500 hover:bg-red-500/30"}>
                  {mover.up ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {mover.change}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
