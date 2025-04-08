
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { AppConfig, BettingPlatform } from "@/types/bet";
import { loadConfig, saveConfig } from "@/utils/storage";
import { Eye, EyeOff, Save } from "lucide-react";

export default function Settings() {
  const [config, setConfig] = useState<AppConfig>(loadConfig());
  const [showPasswords, setShowPasswords] = useState(false);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const { toast } = useToast();
  
  // Initialize local form state from config
  useEffect(() => {
    setConfig(loadConfig());
  }, []);
  
  // Mark pending changes when config changes
  useEffect(() => {
    setHasPendingChanges(true);
  }, [config]);
  
  const updateConfig = (updates: Partial<AppConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };
  
  const updatePlatformCredential = (
    platform: BettingPlatform,
    field: "username" | "password",
    value: string
  ) => {
    setConfig(prev => ({
      ...prev,
      platformCredentials: {
        ...prev.platformCredentials,
        [platform]: {
          ...prev.platformCredentials[platform],
          [field]: value
        }
      }
    }));
  };
  
  const saveSettings = () => {
    saveConfig(config);
    setHasPendingChanges(false);
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully."
    });
  };
  
  const platformSettings = (platform: BettingPlatform) => {
    const credentials = config.platformCredentials[platform] || { username: "", password: "" };
    
    return (
      <div className="space-y-4">
        <CardTitle>{platform}</CardTitle>
        <CardDescription>
          Enter your {platform} account credentials for automated betting.
        </CardDescription>
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor={`${platform.toLowerCase()}-username`}>Username</Label>
            <Input
              id={`${platform.toLowerCase()}-username`}
              placeholder="Username or Email"
              value={credentials.username}
              onChange={(e) => updatePlatformCredential(platform, "username", e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor={`${platform.toLowerCase()}-password`}>Password</Label>
            <div className="relative">
              <Input
                id={`${platform.toLowerCase()}-password`}
                type={showPasswords ? "text" : "password"}
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => updatePlatformCredential(platform, "password", e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowPasswords(!showPasswords)}
              >
                {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Tabs defaultValue="discord">
        <TabsList className="mb-6">
          <TabsTrigger value="discord">Discord</TabsTrigger>
          <TabsTrigger value="betting">Betting Platforms</TabsTrigger>
          <TabsTrigger value="general">General Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="discord">
          <Card>
            <CardHeader>
              <CardTitle>Discord Configuration</CardTitle>
              <CardDescription>
                Configure your Discord account for monitoring bet messages.
                This requires your personal Discord account credentials.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="discord-email">Email</Label>
                <Input
                  id="discord-email"
                  placeholder="your.email@example.com"
                  value={config.discordEmail}
                  onChange={(e) => updateConfig({ discordEmail: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="discord-password">Password</Label>
                <div className="relative">
                  <Input
                    id="discord-password"
                    type={showPasswords ? "text" : "password"}
                    placeholder="Your Discord password"
                    value={config.discordPassword}
                    onChange={(e) => updateConfig({ discordPassword: e.target.value })}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPasswords(!showPasswords)}
                  >
                    {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid gap-2">
                <Label htmlFor="target-server">Server Name</Label>
                <Input
                  id="target-server"
                  placeholder="Server name or ID"
                  value={config.targetServer}
                  onChange={(e) => updateConfig({ targetServer: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="target-channel">Channel Name</Label>
                <Input
                  id="target-channel"
                  placeholder="Channel name or ID"
                  value={config.targetChannel}
                  onChange={(e) => updateConfig({ targetChannel: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="target-user">Target User</Label>
                <Input
                  id="target-user"
                  placeholder="Username or ID to monitor"
                  value={config.targetUser}
                  onChange={(e) => updateConfig({ targetUser: e.target.value })}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setConfig(loadConfig());
                  setHasPendingChanges(false);
                }}
              >
                Reset
              </Button>
              <Button
                onClick={saveSettings}
                disabled={!hasPendingChanges}
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="betting">
          <Card>
            <CardHeader>
              <CardTitle>Betting Platform Credentials</CardTitle>
              <CardDescription>
                Manage your login credentials for various betting platforms.
                These will be used to automatically place bets.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {platformSettings("DraftKings")}
              <Separator />
              {platformSettings("FanDuel")}
              <Separator />
              {platformSettings("BetMGM")}
              <Separator />
              {platformSettings("Caesars")}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setConfig(loadConfig());
                  setHasPendingChanges(false);
                }}
              >
                Reset
              </Button>
              <Button
                onClick={saveSettings}
                disabled={!hasPendingChanges}
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general application settings and behaviors.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="unit-size">Unit Size ($)</Label>
                <Input
                  id="unit-size"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="10.00"
                  value={config.unitSize}
                  onChange={(e) => updateConfig({ unitSize: parseFloat(e.target.value) || 0 })}
                />
                <p className="text-sm text-muted-foreground">
                  This is the base amount for 1 unit (1u). A 0.5u bet would be {(config.unitSize * 0.5).toFixed(2)}.
                </p>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="monitoring-enabled">Monitoring Enabled</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically watch Discord for bet messages.
                  </p>
                </div>
                <Switch
                  id="monitoring-enabled"
                  checked={config.monitoringEnabled}
                  onCheckedChange={(checked) => updateConfig({ monitoringEnabled: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="betting-enabled">Auto-Betting Enabled</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically place bets when messages are detected.
                  </p>
                </div>
                <Switch
                  id="betting-enabled"
                  checked={config.bettingEnabled}
                  onCheckedChange={(checked) => updateConfig({ bettingEnabled: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-start">Auto-Start on Launch</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically start monitoring when the application launches.
                  </p>
                </div>
                <Switch
                  id="auto-start"
                  checked={config.autoStart}
                  onCheckedChange={(checked) => updateConfig({ autoStart: checked })}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setConfig(loadConfig());
                  setHasPendingChanges(false);
                }}
              >
                Reset
              </Button>
              <Button
                onClick={saveSettings}
                disabled={!hasPendingChanges}
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
