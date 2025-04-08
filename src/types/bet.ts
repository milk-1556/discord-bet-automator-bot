
export interface Bet {
  platform: BettingPlatform;
  units: number;
  percentage?: number;
  league?: string;
  link?: string;
  rawMessage: string;
  timestamp: Date;
  status: BetStatus;
  dollarAmount: number;
}

export type BettingPlatform = 
  | 'DraftKings'
  | 'FanDuel'
  | 'BetMGM'
  | 'Caesars'
  | 'Unknown';

export type BetStatus = 
  | 'pending'
  | 'processing'
  | 'placed'
  | 'failed'
  | 'ignored';

export interface BetHistoryItem extends Bet {
  id: string;
  errorMessage?: string;
}

export interface AppConfig {
  discordEmail: string;
  discordPassword: string;
  targetServer: string;
  targetChannel: string;
  targetUser: string;
  unitSize: number;
  platformCredentials: {
    [key in BettingPlatform]?: {
      username: string;
      password: string;
    }
  };
  autoStart: boolean;
  monitoringEnabled: boolean;
  bettingEnabled: boolean;
}
