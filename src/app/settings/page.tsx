
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  User, Shield, Bell, LogOut, Key, 
  Save, AlertTriangle, Trophy,
  ShieldCheck, Landmark, Calculator
} from "lucide-react"
import { useAuth, useUser } from "@/firebase"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { user } = useUser()
  const auth = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  // API Keys
  const [alpacaKey, setAlpacaKey] = useState("PKP5PYAIFV6P3TFZ56D5S5F5RD")
  const [alpacaSecret, setAlpacaSecret] = useState("25yLTf393nHQwBEwJEatF4dMLktwRZbqr8QnuhvNHesR")

  // Prop Firm Challenge Settings
  const [propFirmMode, setPropFirmMode] = useState(true)
  const [accountSize, setAccountSize] = useState("50000")
  const [challengePhase, setChallengePhase] = useState("phase1")
  const [trailingDrawdown, setTrailingDrawdown] = useState(true)
  const [newsTradingAllowed, setNewsTradingAllowed] = useState(false)
  const [maxDailyLoss, setMaxDailyLoss] = useState("5")
  const [maxDrawdown, setMaxDrawdown] = useState("10")
  const [minTradingDays, setMinTradingDays] = useState("5")

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/')
      toast({
        title: "Signed out",
        description: "You have been successfully logged out."
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again."
      })
    }
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Configuration Updated",
        description: "Prop Firm compliance rules and API credentials have been saved to your profile."
      })
    }, 1000)
  }

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 overflow-auto bg-background">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">Configure your institutional terminal and prop firm challenge rules.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2" onClick={() => router.push('/live')}>
             <ShieldCheck className="w-4 h-4" /> Compliance Dashboard
           </Button>
           <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-primary">
            {isSaving ? "Saving..." : "Apply Changes"} <Save className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Account Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-bold">{user?.displayName || 'Strategist'}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[150px]">{user?.email}</div>
                </div>
              </div>
              <Separator />
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Membership Plan</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Enterprise AI Tier</span>
                  <Badge className="bg-accent text-accent-foreground">PRO</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 border-destructive/20 gap-2" onClick={handleLogout}>
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" /> Challenge Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Prop Firm Mode</div>
                  <div className="text-xs text-muted-foreground">Enforce strict compliance rules.</div>
                </div>
                <Switch checked={propFirmMode} onCheckedChange={setPropFirmMode} />
              </div>
              
              {propFirmMode && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                   <div className="space-y-2">
                     <Label className="text-xs">Account Size (USD)</Label>
                     <Select value={accountSize} onValueChange={setAccountSize}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10000">$10,000</SelectItem>
                          <SelectItem value="25000">$25,000</SelectItem>
                          <SelectItem value="50000">$50,000</SelectItem>
                          <SelectItem value="100000">$100,000</SelectItem>
                          <SelectItem value="250000">$250,000</SelectItem>
                        </SelectContent>
                     </Select>
                   </div>
                   <div className="space-y-2">
                     <Label className="text-xs">Evaluation Phase</Label>
                     <Select value={challengePhase} onValueChange={setChallengePhase}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phase1">Phase 1 (10% Target)</SelectItem>
                          <SelectItem value="phase2">Phase 2 (5% Target)</SelectItem>
                          <SelectItem value="funded">Funded (No Target)</SelectItem>
                        </SelectContent>
                     </Select>
                   </div>
                   <div className="flex items-center justify-between py-2">
                      <div className="space-y-0.5">
                        <Label className="text-xs">Trailing Drawdown</Label>
                        <p className="text-[10px] text-muted-foreground">Loss floor follows account peak.</p>
                      </div>
                      <Switch checked={trailingDrawdown} onCheckedChange={setTrailingDrawdown} />
                   </div>
                   <div className="flex items-center justify-between py-2">
                      <div className="space-y-0.5">
                        <Label className="text-xs">News Trading Guard</Label>
                        <p className="text-[10px] text-muted-foreground">Block orders during high impact.</p>
                      </div>
                      <Switch checked={!newsTradingAllowed} onCheckedChange={(v) => setNewsTradingAllowed(!v)} />
                   </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" /> Hard Rules & Limits
              </CardTitle>
              <CardDescription>Hard-coded safety limits that trigger account suspension.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Max Daily Loss (%)</Label>
                  <Input type="number" value={maxDailyLoss} onChange={(e) => setMaxDailyLoss(e.target.value)} />
                  <p className="text-[10px] text-muted-foreground">Usually 3-5% for top-tier firms.</p>
                </div>
                <div className="space-y-2">
                  <Label>Max Total Drawdown (%)</Label>
                  <Input type="number" value={maxDrawdown} onChange={(e) => setMaxDrawdown(e.target.value)} />
                  <p className="text-[10px] text-muted-foreground">Maximum overall loss from balance.</p>
                </div>
                <div className="space-y-2">
                  <Label>Min Trading Days</Label>
                  <Input type="number" value={minTradingDays} onChange={(e) => setMinTradingDays(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Max Open Positions</Label>
                  <Input type="number" defaultValue="5" />
                </div>
              </div>
              
              <div className="p-3 border rounded-lg bg-destructive/5 border-destructive/20 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-sm font-bold text-destructive">Circuit Breaker Active</div>
                  <p className="text-xs text-muted-foreground">The terminal will automatically liquidate all positions and suspend trading if these limits are breached to preserve your challenge standing.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" /> Exchange Connectivity
              </CardTitle>
              <CardDescription>Manage API keys for live and paper execution environments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-accent/10">Alpaca Markets</Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-green-500 font-bold">CONNECTED</span>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Alpaca Key ID</Label>
                    <Input 
                      type="text" 
                      value={alpacaKey}
                      onChange={(e) => setAlpacaKey(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Alpaca Secret Key</Label>
                    <Input 
                      type="password" 
                      value={alpacaSecret}
                      onChange={(e) => setAlpacaSecret(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4 opacity-50">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-primary/10">Binance Futures</Badge>
                  <Badge variant="secondary" className="text-[10px]">SOON</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input disabled type="password" placeholder="************************" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Secret</Label>
                    <Input disabled type="password" placeholder="************************" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
