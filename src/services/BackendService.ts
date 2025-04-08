
import { AppConfig, BetHistoryItem } from "@/types/bet";
import { toast } from "@/components/ui/use-toast";

// Constants for backend API endpoint
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export interface MonitoringStatus {
  isConnected: boolean;
  isRunning: boolean;
  lastMessage?: string;
  lastTimestamp?: Date;
  availableBonuses?: Record<string, string[]>;
}

/**
 * Service for interacting with the Python backend that handles
 * Discord monitoring and bet placement
 */
class BackendService {
  private status: MonitoringStatus = {
    isConnected: false,
    isRunning: false
  };

  /**
   * Check if the backend service is available
   */
  async checkConnection(): Promise<boolean> {
    try {
      // In a real implementation, this would ping your backend
      console.log("Checking backend connection...");
      
      // Simulate a backend ping
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, we'll simulate a successful connection
      this.status.isConnected = true;
      return true;
    } catch (error) {
      this.status.isConnected = false;
      console.error("Backend connection error:", error);
      return false;
    }
  }

  /**
   * Start the monitoring process in the backend
   */
  async startMonitoring(config: AppConfig): Promise<boolean> {
    try {
      console.log("Starting monitoring with config:", config);
      
      // Simulate backend start request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update status
      this.status.isRunning = true;
      this.status.lastMessage = "Monitoring started successfully";
      this.status.lastTimestamp = new Date();
      
      return true;
    } catch (error) {
      console.error("Failed to start monitoring:", error);
      toast({
        title: "Failed to start monitoring",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
      return false;
    }
  }

  /**
   * Stop the monitoring process in the backend
   */
  async stopMonitoring(): Promise<boolean> {
    try {
      console.log("Stopping monitoring");
      
      // Simulate backend stop request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update status
      this.status.isRunning = false;
      this.status.lastMessage = "Monitoring stopped successfully";
      this.status.lastTimestamp = new Date();
      
      return true;
    } catch (error) {
      console.error("Failed to stop monitoring:", error);
      toast({
        title: "Failed to stop monitoring",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
      return false;
    }
  }

  /**
   * Get the current status of the monitoring service
   */
  getStatus(): MonitoringStatus {
    return { ...this.status };
  }

  /**
   * Get available bonuses for a platform
   */
  async getAvailableBonuses(platform: string, config: AppConfig): Promise<string[]> {
    try {
      console.log(`Fetching available bonuses for ${platform}`);
      
      // In a real implementation, this would fetch from backend
      // For now, return mock data
      const mockBonuses: Record<string, string[]> = {
        'DraftKings': ['free_bet', '25%_boost', '50%_boost', '100%_boost', 'odds_boost', 'parlay_insurance'],
        'FanDuel': ['free_bet', 'odds_boost', 'same_game_parlay', 'refer_friend_bonus'],
        'BetMGM': ['free_bet', 'parlay_boost', 'deposit_match', 'risk_free_bet'],
        'Caesars': ['free_bet', 'odds_boost', 'deposit_match', '200%_boost']
      };
      
      return mockBonuses[platform] || [];
    } catch (error) {
      console.error(`Failed to fetch bonuses for ${platform}:`, error);
      return [];
    }
  }

  /**
   * Run a test bet placement (useful for testing credentials)
   */
  async testBetPlacement(platform: string, config: AppConfig, bonus?: string): Promise<boolean> {
    try {
      console.log(`Testing ${platform} bet placement with config:`, config);
      if (bonus) {
        console.log(`Using bonus: ${bonus}`);
      }
      
      // Simulate a backend test request
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For now, just return success
      return true;
    } catch (error) {
      console.error(`Failed to test ${platform} bet placement:`, error);
      return false;
    }
  }

  /**
   * Determine the best matching bonus based on a requested bonus string
   */
  async findBestMatchingBonus(platform: string, requestedBonus: string, config: AppConfig): Promise<string | undefined> {
    const availableBonuses = await this.getAvailableBonuses(platform, config);
    
    // Exact match
    if (availableBonuses.includes(requestedBonus)) {
      return requestedBonus;
    }
    
    // Look for keyword matches
    const lowerRequested = requestedBonus.toLowerCase();
    
    // Check for free bet
    if (lowerRequested.includes('free')) {
      const freeBet = availableBonuses.find(b => b.includes('free'));
      if (freeBet) return freeBet;
    }
    
    // Check for boost percentage
    const percentMatch = lowerRequested.match(/(\d+)%/);
    if (percentMatch) {
      const requestedPercent = parseInt(percentMatch[1]);
      
      // Find available percentage boosts
      const percentBoosts = availableBonuses
        .filter(b => b.includes('%'))
        .map(b => {
          const match = b.match(/(\d+)%/);
          return match ? { bonus: b, percent: parseInt(match[1]) } : null;
        })
        .filter((item): item is { bonus: string, percent: number } => item !== null);
      
      if (percentBoosts.length > 0) {
        // Find closest percentage match
        percentBoosts.sort((a, b) => 
          Math.abs(a.percent - requestedPercent) - Math.abs(b.percent - requestedPercent)
        );
        return percentBoosts[0].bonus;
      }
    }
    
    // Check for other keyword matches
    if (lowerRequested.includes('boost')) {
      const boost = availableBonuses.find(b => b.includes('boost'));
      if (boost) return boost;
    }
    
    if (lowerRequested.includes('match')) {
      const match = availableBonuses.find(b => b.includes('match'));
      if (match) return match;
    }
    
    // Default to the first available bonus if we can't find a match
    return availableBonuses.length > 0 ? availableBonuses[0] : undefined;
  }

  /**
   * Update the backend configuration
   */
  async updateBackendConfig(config: AppConfig): Promise<boolean> {
    try {
      console.log("Updating backend configuration:", config);
      
      // Simulate a config update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error("Failed to update backend configuration:", error);
      return false;
    }
  }
}

// Export a singleton instance
export const backendService = new BackendService();
