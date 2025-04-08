
import { AppConfig, BetHistoryItem } from "@/types/bet";

// Default configuration values
const DEFAULT_CONFIG: AppConfig = {
  discordEmail: "",
  discordPassword: "",
  targetServer: "",
  targetChannel: "",
  targetUser: "",
  unitSize: 10,
  platformCredentials: {},
  autoStart: false,
  monitoringEnabled: true,
  bettingEnabled: false,
  backendUrl: "http://localhost:5000" // Default backend URL
};

// Key for local storage
const CONFIG_KEY = "discord-bet-automator-config";
const BET_HISTORY_KEY = "discord-bet-automator-history";

// Load configuration from local storage
export function loadConfig(): AppConfig {
  try {
    const storedConfig = localStorage.getItem(CONFIG_KEY);
    if (storedConfig) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(storedConfig) };
    }
  } catch (error) {
    console.error("Failed to load config:", error);
  }
  return DEFAULT_CONFIG;
}

// Save configuration to local storage
export function saveConfig(config: AppConfig): void {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error("Failed to save config:", error);
  }
}

// Load bet history from local storage
export function loadBetHistory(): BetHistoryItem[] {
  try {
    const storedHistory = localStorage.getItem(BET_HISTORY_KEY);
    if (storedHistory) {
      const history = JSON.parse(storedHistory);
      // Convert string timestamps back to Date objects
      return history.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
    }
  } catch (error) {
    console.error("Failed to load bet history:", error);
  }
  return [];
}

// Save bet history to local storage
export function saveBetHistory(history: BetHistoryItem[]): void {
  try {
    localStorage.setItem(BET_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save bet history:", error);
  }
}

// Add a new bet to history
export function addBetToHistory(bet: BetHistoryItem): void {
  const history = loadBetHistory();
  history.unshift(bet); // Add to the beginning of the array
  saveBetHistory(history);
}
