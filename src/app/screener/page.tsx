
"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  TrendingUp, TrendingDown, Filter, Download, 
  ChevronRight, ArrowUpDown, Search, Star, Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MarketItem {
  symbol: string;
  price: number;
  change: number;
  volume: string;
  rsi: number;
  status: string;
  market: 'crypto' | 'forex' | 'stocks';
  isFavorite?: boolean;
}

const INITIAL_DATA: MarketItem[] = [
  { symbol: 'BTC/USDT', price: 64231.50, change: 4.2, volume: '2.4B', rsi: 65, status: 'Bullish', market: 'crypto' },
  { symbol: 'ETH/USDT', price: 3421.20, change: 2.1, volume: '1.1B', rsi: 58, status: 'Neutral', market: 'crypto' },
  { symbol: 'SOL/USDT', price: 142.55, change: -1.8, volume: '800M', rsi: 42, status: 'Bearish', market: 'crypto' },
  { symbol: 'EUR/USD', price: 1.0845, change: 0.15, volume: '4.2T', rsi: 51, status: 'Neutral', market: 'forex' },
  { symbol: 'GBP/JPY', price: 191.22, change: -0.42, volume: '1.8T', rsi: 38, status: 'Bearish', market: 'forex' },
  { symbol: 'AAPL', price: 182.41, change: 1.2, volume: '54M', rsi: 62, status: 'Bullish', market: 'stocks' },
  { symbol: 'TSLA', price: 175.05, change: -3.5, volume: '82M', rsi: 29, status: 'Oversold', market: 'stocks' },
  { symbol: 'NVDA', price: 875.22, change: 6.8, volume: '45M', rsi: 78, status: 'Overbought', market: 'stocks' },
  { symbol: 'LINK/USDT', price: 18.22, change: 2.8, volume: '210M', rsi: 60, status: 'Bullish', market: 'crypto' },
  { symbol: 'DOT/USDT', price: 7.45, change: -3.2, volume: '140M', rsi: 28, status: 'Oversold', market: 'crypto' },
]

export default function ScreenerPage() {
  const [data, setData] = useState<MarketItem[]>(INITIAL_DATA)
  const [searchTerm, setSearchTerm] = useState("")
  const [marketFilter, setMarketFilter] = useState("all")
  const [timeframe, setTimeframe] = useState("1h")
  const [sortConfig, setSortConfig] = useState<{ key: keyof MarketItem; direction: 'asc' | 'desc' } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(current => current.map(item => {
        const volatility = item.market === 'crypto' ? 0.002 : 0.0005
        const priceChange = item.price * (Math.random() - 0.5) * volatility
        const newPrice = item.price + priceChange
        const newRsi = Math.min(Math.max(item.rsi + (Math.random() - 0.5) * 2, 0), 100)
        
        let status = 'Neutral'
        if (newRsi > 70) status = 'Overbought'
        else if (newRsi < 30) status = 'Oversold'
        else if (item.change > 2) status = 'Bullish'
        else if (item.change < -2) status = 'Bearish'

        return {
          ...item,
          price: newPrice,
          rsi: Math.round(newRsi),
          status
        }
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleSort = (key: keyof MarketItem) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const filteredAndSortedData = useMemo(() => {
    let result = data.filter(item => {
      const matchesSearch = item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesMarket = marketFilter === 'all' || item.market === marketFilter
      return matchesSearch && matchesMarket
    })

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]
        if (aValue === undefined || bValue === undefined) return 0
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  }, [data, searchTerm, marketFilter, sortConfig])

  const toggleFavorite = (symbol: string) => {
    setData(current => current.map(item => 
      item.symbol === symbol ? { ...item, isFavorite: !item.isFavorite } : item
    ))
    const item = data.find(i => i.symbol === symbol)
    toast({
      title: item?.isFavorite ? "Removed from watchlist" : "Added to watchlist",
      description: `${symbol} updated in your favorites.`
    })
  }

  const handleExport = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Export Success",
        description: `CSV file with ${filteredAndSortedData.length} symbols generated.`
      })
    }, 1500)
  }

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 overflow-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Market Screener</h1>
          <p className="text-muted-foreground">Real-time indicators across global markets.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExport} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Export CSV
          </Button>
          <Button className="gap-2 bg-primary">
            <Filter className="w-4 h-4" /> Filters
          </Button>
        </div>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3 border-b border-border mb-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search symbol (e.g. BTC, NVDA, EUR)..." 
                className="pl-9 bg-background/50 border-border/50" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
               <Select value={marketFilter} onValueChange={setMarketFilter}>
                 <SelectTrigger className="w-[150px] bg-background/50">
                   <SelectValue placeholder="Market" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Markets</SelectItem>
                   <SelectItem value="crypto">Crypto</SelectItem>
                   <SelectItem value="forex">Forex</SelectItem>
                   <SelectItem value="stocks">Stocks</SelectItem>
                 </SelectContent>
               </Select>
               <Select value={timeframe} onValueChange={setTimeframe}>
                 <SelectTrigger className="w-[120px] bg-background/50">
                   <SelectValue placeholder="Timeframe" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="1m">1m</SelectItem>
                   <SelectItem value="15m">15m</SelectItem>
                   <SelectItem value="1h">1h</SelectItem>
                   <SelectItem value="4h">4h</SelectItem>
                   <SelectItem value="1d">1d</SelectItem>
                 </SelectContent>
               </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="cursor-pointer group" onClick={() => handleSort('symbol')}>
                  <div className="flex items-center gap-1">
                    Symbol <ArrowUpDown className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer group" onClick={() => handleSort('price')}>
                  <div className="flex items-center justify-end gap-1">
                    Price <ArrowUpDown className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer group" onClick={() => handleSort('change')}>
                  <div className="flex items-center justify-end gap-1">
                    Change (24h) <ArrowUpDown className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer group" onClick={() => handleSort('volume')}>
                  <div className="flex items-center justify-end gap-1">
                    Volume <ArrowUpDown className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer group" onClick={() => handleSort('rsi')}>
                  <div className="flex items-center justify-end gap-1">
                    RSI (14) <ArrowUpDown className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                  </div>
                </TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData.map((row) => (
                <TableRow key={row.symbol} className="border-border/40 hover:bg-white/5 transition-colors">
                  <TableCell className="text-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-8 w-8 transition-colors ${row.isFavorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-muted-foreground hover:text-yellow-500'}`}
                      onClick={() => toggleFavorite(row.symbol)}
                    >
                      <Star className={`w-4 h-4 ${row.isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{row.symbol}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{row.market}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {row.market === 'forex' ? row.price.toFixed(4) : row.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className={`text-right font-bold ${row.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <div className="flex items-center justify-end gap-1">
                      {row.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {row.change >= 0 ? '+' : ''}{row.change}%
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{row.volume}</TableCell>
                  <TableCell className="text-right">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${row.rsi > 70 ? 'bg-red-500/20 text-red-500' : row.rsi < 30 ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                      {row.rsi}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={
                      row.status === 'Bullish' ? "border-green-500/50 text-green-500" :
                      row.status === 'Bearish' ? "border-red-500/50 text-red-500" :
                      row.status === 'Overbought' ? "bg-red-500 text-white border-none" :
                      row.status === 'Oversold' ? "bg-green-500 text-white border-none" :
                      "text-muted-foreground border-border/50"
                    }>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 text-[11px] gap-1 hover:bg-primary/20 hover:text-primary transition-all">
                      Analysis <ChevronRight className="w-3 h-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAndSortedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    No symbols found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
