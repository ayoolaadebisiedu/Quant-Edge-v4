
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  TrendingUp, TrendingDown, Filter, Download, 
  ChevronRight, ArrowUpDown, Search, Star
} from "lucide-react"

const marketData = [
  { symbol: 'BTC/USDT', price: '64,231.50', change: '+4.2%', volume: '2.4B', rsi: 65, status: 'Bullish' },
  { symbol: 'ETH/USDT', price: '3,421.20', change: '+2.1%', volume: '1.1B', rsi: 58, status: 'Neutral' },
  { symbol: 'SOL/USDT', price: '142.55', change: '-1.8%', volume: '800M', rsi: 42, status: 'Bearish' },
  { symbol: 'BNB/USDT', price: '582.10', change: '+0.5%', volume: '450M', rsi: 52, status: 'Neutral' },
  { symbol: 'XRP/USDT', price: '0.62', change: '-0.2%', volume: '220M', rsi: 48, status: 'Neutral' },
  { symbol: 'ADA/USDT', price: '0.45', change: '+1.2%', volume: '180M', rsi: 55, status: 'Neutral' },
  { symbol: 'AVAX/USDT', price: '38.12', change: '+6.5%', volume: '320M', rsi: 72, status: 'Overbought' },
  { symbol: 'DOT/USDT', price: '7.45', change: '-3.2%', volume: '140M', rsi: 28, status: 'Oversold' },
  { symbol: 'LINK/USDT', price: '18.22', change: '+2.8%', volume: '210M', rsi: 60, status: 'Bullish' },
  { symbol: 'MATIC/USDT', price: '0.72', change: '-1.5%', volume: '95M', rsi: 45, status: 'Neutral' },
]

export default function ScreenerPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 overflow-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Screener</h1>
          <p className="text-muted-foreground">Real-time indicators across 1,000+ symbols.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button className="gap-2 bg-primary">
            <Filter className="w-4 h-4" /> Filters
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-border mb-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search symbol..." 
                className="pl-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
               <Select defaultValue="all">
                 <SelectTrigger className="w-[150px]">
                   <SelectValue placeholder="Market" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Markets</SelectItem>
                   <SelectItem value="crypto">Crypto</SelectItem>
                   <SelectItem value="forex">Forex</SelectItem>
                   <SelectItem value="stocks">US Stocks</SelectItem>
                 </SelectContent>
               </Select>
               <Select defaultValue="1h">
                 <SelectTrigger className="w-[120px]">
                   <SelectValue placeholder="Timeframe" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="5m">5 Minutes</SelectItem>
                   <SelectItem value="15m">15 Minutes</SelectItem>
                   <SelectItem value="1h">1 Hour</SelectItem>
                   <SelectItem value="1d">Daily</SelectItem>
                 </SelectContent>
               </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="cursor-pointer">
                  Symbol <ArrowUpDown className="w-3 h-3 inline ml-1" />
                </TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Change (24h)</TableHead>
                <TableHead className="text-right">Volume</TableHead>
                <TableHead className="text-right">RSI (14)</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketData
                .filter(item => item.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((row) => (
                <TableRow key={row.symbol}>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-yellow-500">
                      <Star className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="font-semibold">{row.symbol}</TableCell>
                  <TableCell className="text-right">${row.price}</TableCell>
                  <TableCell className={`text-right ${row.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {row.change}
                  </TableCell>
                  <TableCell className="text-right">{row.volume}</TableCell>
                  <TableCell className="text-right">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono ${row.rsi > 70 ? 'bg-red-500/20 text-red-500' : row.rsi < 30 ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                      {row.rsi}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={
                      row.status === 'Bullish' ? "border-green-500/50 text-green-500" :
                      row.status === 'Bearish' ? "border-red-500/50 text-red-500" :
                      row.status === 'Overbought' ? "bg-red-500 text-white border-none" :
                      row.status === 'Oversold' ? "bg-green-500 text-white border-none" :
                      "text-muted-foreground"
                    }>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                      Details <ChevronRight className="w-3 h-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
