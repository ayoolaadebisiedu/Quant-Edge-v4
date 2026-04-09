
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Code2, Sparkles, Play, Save, Bug, Search, 
  Terminal, Lightbulb, Wand2, ArrowRight
} from "lucide-react"
import { generateStrategy } from '@/ai/flows/ai-strategy-generator'
import { useToast } from "@/hooks/use-toast"

export default function EditorPage() {
  const [code, setCode] = useState(`class GoldenCross(Strategy):
    def should_long(self):
        # go long when the EMA 8 is above the EMA 21
        short_ema = ta.ema(self.candles, 8)
        long_ema = ta.ema(self.candles, 21)
        return short_ema > long_ema

    def go_long(self):
        entry_price = self.price - 10
        qty = utils.size_to_qty(self.balance*0.05, entry_price)
        self.buy = qty, entry_price
        self.take_profit = qty, entry_price*1.2
        self.stop_loss = qty, entry_price*0.9`)
  
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleAiGenerate = async () => {
    if (!prompt) return
    setIsGenerating(true)
    try {
      const result = await generateStrategy({
        strategyDescription: prompt,
        programmingLanguage: 'python'
      })
      setCode(result.generatedCode)
      toast({
        title: "Strategy Generated",
        description: "AI has successfully drafted your trading logic."
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate strategy. Please try again."
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Editor Toolbar */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-card">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Code2 className="w-4 h-4 text-primary" />
            <span>golden_cross_v2.py</span>
            <Badge variant="outline" className="text-[10px] h-5">Python 3.9</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2">
            <Save className="w-4 h-4" /> Save
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-500/10">
            <Bug className="w-4 h-4" /> Debug
          </Button>
          <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
            <Play className="w-4 h-4" /> Run Backtest
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Code Editor Area */}
        <div className="flex-1 flex flex-col border-r border-border">
          <div className="flex-1 p-0 overflow-hidden bg-[#0D0F11]">
             <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full p-6 font-code text-sm bg-transparent border-none focus:ring-0 text-gray-300 resize-none outline-none leading-relaxed"
              spellCheck="false"
             />
          </div>
          <div className="h-32 border-t border-border bg-card overflow-hidden flex flex-col">
            <div className="px-3 py-1 border-b border-border bg-muted/50 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Terminal className="w-3 h-3" /> Console Output
              </span>
            </div>
            <div className="flex-1 p-3 font-code text-xs text-green-500/80 overflow-y-auto">
              [SYSTEM] Strategy compiled successfully.<br />
              [INFO] ta library initialized (300+ indicators ready).<br />
              [READY] Press 'Run' to start backtesting against BTC/USDT 1h data.
            </div>
          </div>
        </div>

        {/* Right: AI Assistant & Tools */}
        <div className="w-[380px] flex flex-col bg-card overflow-hidden">
          <Tabs defaultValue="ai" className="flex flex-col h-full">
            <div className="px-4 border-b border-border">
              <TabsList className="w-full bg-transparent p-0 h-12">
                <TabsTrigger value="ai" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  <Sparkles className="w-4 h-4 mr-2" /> JesseGPT
                </TabsTrigger>
                <TabsTrigger value="docs" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  <Search className="w-4 h-4 mr-2" /> Libs
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="ai" className="flex-1 flex flex-col overflow-hidden m-0 p-4 gap-4">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs text-primary leading-relaxed flex gap-3">
                <Lightbulb className="w-8 h-8 shrink-0" />
                <p>Describe your strategy ideas in plain English. I'll write the Jesse-compatible Python code for you.</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Describe Logic</label>
                  <Textarea 
                    placeholder="E.g. Go long when RSI is below 30 and volume is 2x average. Exit when RSI reaches 70..."
                    className="min-h-[120px] text-sm resize-none"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <Button 
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90" 
                    onClick={handleAiGenerate}
                    disabled={isGenerating || !prompt}
                  >
                    {isGenerating ? "Thinking..." : "Generate Logic"} <Wand2 className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <div className="pt-4 border-t border-border">
                   <label className="text-[10px] font-bold uppercase text-muted-foreground mb-2 block">Quick Suggestions</label>
                   <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start text-[11px] h-auto py-2" onClick={() => setPrompt("Add a Trailing Stop Loss to this strategy")}>
                        <ArrowRight className="w-3 h-3 mr-2 text-primary" /> Add Trailing Stop Loss
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start text-[11px] h-auto py-2" onClick={() => setPrompt("Convert this to a trend-following breakout strategy")}>
                        <ArrowRight className="w-3 h-3 mr-2 text-primary" /> Make it Trend-Following
                      </Button>
                   </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="docs" className="flex-1 overflow-y-auto m-0 p-4">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search Indicators..." className="pl-9 h-9" />
                </div>
                <div className="space-y-2">
                  <div className="p-2 rounded border border-border hover:bg-muted cursor-help transition-colors">
                    <div className="font-bold text-sm">ta.ema(candles, period)</div>
                    <div className="text-xs text-muted-foreground mt-1">Exponential Moving Average. Returns an array of values.</div>
                  </div>
                  <div className="p-2 rounded border border-border hover:bg-muted cursor-help transition-colors">
                    <div className="font-bold text-sm">ta.rsi(candles, period)</div>
                    <div className="text-xs text-muted-foreground mt-1">Relative Strength Index. Used to identify overbought/oversold.</div>
                  </div>
                  <div className="p-2 rounded border border-border hover:bg-muted cursor-help transition-colors">
                    <div className="font-bold text-sm">ta.bollinger_bands(candles)</div>
                    <div className="text-xs text-muted-foreground mt-1">Returns (upper, middle, lower) bands.</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
