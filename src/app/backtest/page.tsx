
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  History, Calendar, Coins, TrendingUp, AlertCircle, 
  BarChart4, FileText, Settings2, PlayCircle, Loader2
} from "lucide-react"

export default function BacktestPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleRun = () => {
    setIsRunning(true)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsRunning(false)
          return 100
        }
        return prev + 5
      })
    }, 150)
  }

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 overflow-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Strategy Backtesting</h1>
          <p className="text-muted-foreground">Verify your strategies with high-precision historical data.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Settings2 className="w-4 h-4" /> Advanced Config
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Configuration Sidebar */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="w-4 h-4 text-primary" /> Session Config
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Select Strategy</Label>
              <Select defaultValue="golden-cross">
                <SelectTrigger>
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="golden-cross">Golden Cross EMA</SelectItem>
                  <SelectItem value="mean-reversion">Mean Reversion RSI</SelectItem>
                  <SelectItem value="breakout">Bollinger Breakout</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Symbol</Label>
              <div className="flex gap-2">
                <Input defaultValue="BTC/USDT" className="flex-1" />
                <Badge variant="outline" className="bg-muted">1h</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Time Range</Label>
              <div className="grid grid-cols-1 gap-2">
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input defaultValue="2023-01-01" className="pl-9 text-sm" />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input defaultValue="2024-01-01" className="pl-9 text-sm" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Initial Capital</Label>
              <div className="relative">
                <Coins className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input defaultValue="10,000" className="pl-9" />
              </div>
            </div>

            <Button 
              className="w-full bg-primary hover:bg-primary/90 mt-4" 
              onClick={handleRun}
              disabled={isRunning}
            >
              {isRunning ? (
                <> <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Running... </>
              ) : (
                <> <PlayCircle className="w-4 h-4 mr-2" /> Start Backtest </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Area */}
        <div className="lg:col-span-3 space-y-6">
          {isRunning && (
             <Card className="animate-in fade-in slide-in-from-top-4 duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Processing historical candles...</span>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </CardContent>
             </Card>
          )}

          {!isRunning && progress === 100 && (
            <div className="space-y-6 animate-in fade-in duration-500">
               {/* Summary Stats */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-green-500/5 border-green-500/20">
                    <CardContent className="pt-6">
                      <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Return</div>
                      <div className="text-2xl font-bold text-green-500">+42.15%</div>
                      <div className="text-sm text-green-500/70">+$4,215.00</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-500/5 border-red-500/20">
                    <CardContent className="pt-6">
                      <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Max Drawdown</div>
                      <div className="text-2xl font-bold text-red-500">-8.4%</div>
                      <div className="text-sm text-red-500/70">Peak-to-Trough</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6">
                      <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Profit Factor</div>
                      <div className="text-2xl font-bold text-primary">2.14</div>
                      <div className="text-sm text-primary/70">Risk/Reward Alpha</div>
                    </CardContent>
                  </Card>
               </div>

               <Card>
                 <CardHeader className="flex flex-row items-center justify-between">
                   <CardTitle className="flex items-center gap-2">
                     <BarChart4 className="w-5 h-5 text-primary" /> Performance Analysis
                   </CardTitle>
                   <div className="flex gap-2">
                     <Button variant="ghost" size="sm"><FileText className="w-4 h-4 mr-2" /> View Logs</Button>
                   </div>
                 </CardHeader>
                 <CardContent className="h-[300px] flex items-center justify-center border-t border-border mt-4">
                   <div className="text-center text-muted-foreground">
                      <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Detailed trade visualization map would be rendered here.</p>
                      <p className="text-xs">Supports 10,000+ data points for extreme precision.</p>
                   </div>
                 </CardContent>
               </Card>
            </div>
          )}

          {progress === 0 && !isRunning && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center opacity-40">
              <TrendingUp className="w-16 h-16 mb-4 text-muted-foreground" />
              <h3 className="text-xl font-headline font-medium">Ready to Test</h3>
              <p className="max-w-xs mt-2 text-sm">Configure your strategy parameters and date range on the left to begin simulation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
