
"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Maximize2, Layers, TrendingUp, TrendingDown } from "lucide-react"
import { INITIAL_MARKET_DATA } from '@/lib/market-data'

export default function MarketMapPage() {
  const [data, setData] = useState(INITIAL_MARKET_DATA)

  useEffect(() => {
    const interval = setInterval(() => {
      setData(current => current.map(item => ({
        ...item,
        change: item.change + (Math.random() - 0.5) * 0.1
      })))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 overflow-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Heatmap</h1>
          <p className="text-muted-foreground">Live visualization of cross-market performance (Binance & Alpaca Feeds).</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-2">
            <Layers className="w-4 h-4" /> Market Cap Weight
          </Badge>
          <Badge variant="secondary" className="gap-2 cursor-pointer">
            <Maximize2 className="w-4 h-4" /> Fullscreen
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((asset) => (
          <Card key={asset.symbol} className={`group border-2 transition-all hover:scale-[1.02] cursor-pointer ${
            asset.change >= 0 
              ? 'bg-green-500/5 border-green-500/20 hover:border-green-500/40' 
              : 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex flex-col">
                <CardTitle className="text-lg font-bold">{asset.symbol}</CardTitle>
                <span className="text-[10px] text-muted-foreground uppercase">{asset.market}</span>
              </div>
              <div className={`flex items-center gap-1 font-mono font-bold ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {asset.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {asset.change.toFixed(2)}%
              </div>
            </CardHeader>
            <CardContent className="pt-4 h-24 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
               <div className="text-xs font-mono">
                 PRC: ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
               </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
