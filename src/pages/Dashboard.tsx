
import { useState, useEffect } from "react";
import { Bot, MessageSquare, DollarSign, Activity } from "lucide-react";
import StatusCard from "@/components/StatusCard";
import { Button } from "@/components/ui/button";
import BetHistoryTable from "@/components/BetHistoryTable";
import { parseBetFromMessage } from "@/utils/betParser";
import { loadBetHistory, loadConfig, addBetToHistory } from "@/utils/storage";
import { v4 as uuidv4 } from "uuid";
import { BetHistoryItem } from "@/types/bet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { backendService } from "@/services/BackendService";

export default function Dashboard() {
  const { toast } = useToast();
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [discordStatus, setDiscordStatus] = useState<"online" | "offline" | "warning" | "error">("offline");
  const [backendStatus, setBackendStatus] = useState<"online" | "offline" | "warning" | "error">("offline");
  const [betHistory, setBetHistory] = useState<BetHistoryItem[]>([]);
  const [config, setConfig] = useState(loadConfig());
  
  useEffect(() => {
    // Load bet history on mount
    setBetHistory(loadBetHistory().slice(0, 5)); // Show only last 5 bets
    
    // Check backend connection
    checkBackendConnection();
    
    // Check if auto-start is enabled
    if (config.autoStart) {
      handleStartMonitoring();
    }
  }, []);
  
  // Check if backend service is available
  const checkBackendConnection = async () => {
    const isConnected = await backendService.checkConnection();
    setBackendStatus(isConnected ? "online" : "error");
  };
  
  // Start monitoring with backend service
  const handleStartMonitoring = async () => {
    setDiscordStatus("warning");
    toast({
      title: "Connecting to Discord...",
      description: "Attempting to establish connection."
    });
    
    const success = await backendService.startMonitoring(config);
    
    if (success) {
      setIsMonitoring(true);
      setDiscordStatus("online");
      toast({
        title: "Monitoring active",
        description: "Successfully connected to Discord. Watching for bet messages."
      });
    } else {
      setDiscordStatus("error");
      toast({
        title: "Connection failed",
        description: "Could not connect to Discord. Check your credentials.",
        variant: "destructive"
      });
    }
  };
  
  // Stop monitoring with backend service
  const handleStopMonitoring = async () => {
    const success = await backendService.stopMonitoring();
    
    if (success) {
      setIsMonitoring(false);
      setDiscordStatus("offline");
      toast({
        title: "Monitoring stopped",
        description: "Discord monitoring has been paused."
      });
    }
  };
  
  // Toggle monitoring
  const toggleMonitoring = () => {
    if (isMonitoring) {
      handleStopMonitoring();
    } else {
      handleStartMonitoring();
    }
  };
  
  // This is a mock function to simulate receiving a bet message
  const simulateBetMessage = () => {
    const messages = [
      "@book-dk 0.25u 20% MLB",
      "@book-fd 1u NFL",
      "@book-mgm 0.5u 50% NBA",
      "@book-dk 0.75u https://sportsbook.example.com/bet/12345",
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    processBetMessage(randomMessage);
  };
  
  // Process a bet message
  const processBetMessage = (message: string) => {
    const parsedBet = parseBetFromMessage(message, config.unitSize);
    
    if (!parsedBet) {
      toast({
        title: "Invalid bet format",
        description: "Could not parse bet information from message.",
        variant: "destructive"
      });
      return;
    }
    
    // Create a bet history item
    const betHistoryItem: BetHistoryItem = {
      ...parsedBet,
      id: uuidv4()
    };
    
    // Add to history
    addBetToHistory(betHistoryItem);
    
    // Update local state with the new bet
    setBetHistory(prev => [betHistoryItem, ...prev].slice(0, 5));
    
    // Show toast notification
    toast({
      title: `New bet detected: ${parsedBet.platform}`,
      description: `${parsedBet.units}u ${parsedBet.percentage ? `${parsedBet.percentage}% ` : ''}for $${parsedBet.dollarAmount.toFixed(2)}`
    });
    
    // Simulate bet placement after a delay
    setTimeout(() => {
      // Update the bet status to placed (90% chance) or failed (10% chance)
      const success = Math.random() > 0.1;
      const updatedBet: BetHistoryItem = {
        ...betHistoryItem,
        status: success ? "placed" : "failed",
        errorMessage: success ? undefined : "Connection timeout while placing bet"
      };
      
      // Update in history
      addBetToHistory(updatedBet);
      
      // Update local state
      setBetHistory(prev => 
        prev.map(bet => bet.id === updatedBet.id ? updatedBet : bet)
      );
      
      // Show toast
      toast({
        title: success ? "Bet placed successfully" : "Failed to place bet",
        description: success 
          ? `${updatedBet.platform}: $${updatedBet.dollarAmount.toFixed(2)}` 
          : "Error: Connection timeout while placing bet",
        variant: success ? "default" : "destructive"
      });
    }, 3000);
  };
  
  return (
    <div className="container mx-auto py-8 space-y-8 bg-background text-foreground">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard
          title="Discord Connection"
          status={discordStatus}
          description={discordStatus === "online" 
            ? "Monitoring messages in real-time" 
            : "Not currently monitoring Discord"}
          icon={
            <div className="flex justify-center">
              <MessageSquare size={48} className="text-discord" />
            </div>
          }
        />
        
        <StatusCard
          title="Betting Status"
          status={isMonitoring ? "online" : "offline"}
          description={isMonitoring 
            ? "Auto-betting is enabled and active" 
            : "Auto-betting is currently disabled"}
          icon={
            <div className="flex justify-center">
              <DollarSign size={48} className="text-green-500" />
            </div>
          }
        />
        
        <StatusCard
          title="Backend Service"
          status={backendStatus}
          description={backendStatus === "online" 
            ? `Connected to automation service` 
            : "Backend automation service not available"}
          icon={
            <div className="flex justify-center">
              <Bot size={48} className="text-primary" />
            </div>
          }
        />
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity size={18} />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BetHistoryTable bets={betHistory} />
            
            <div className="mt-4 flex justify-end gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => simulateBetMessage()}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                Simulate Bet Message
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={checkBackendConnection}
                className="bg-accent text-accent-foreground hover:bg-accent/80"
              >
                Check Backend
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center pt-4">
        <Button 
          size="lg" 
          onClick={toggleMonitoring}
          variant={isMonitoring ? "destructive" : "default"}
          className="w-full max-w-md"
          disabled={backendStatus !== "online"}
        >
          {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
        </Button>
      </div>
    </div>
  );
}
