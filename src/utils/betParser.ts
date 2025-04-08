
import { Bet, BettingPlatform } from "@/types/bet";

// Regular expression to match betting patterns
const BET_REGEX = /@book-([a-z]+)\s+([\d.]+)u(?:\s+(\d+)%)?(?:\s+([a-z]+))?/i;

export function parseBetFromMessage(
  message: string,
  unitSize: number
): Bet | null {
  const match = message.match(BET_REGEX);
  
  if (!match) return null;
  
  const platformCode = match[1].toLowerCase();
  const units = parseFloat(match[2]);
  const percentage = match[3] ? parseInt(match[3]) : undefined;
  const league = match[4] ? match[4].toUpperCase() : undefined;
  
  // Extract potential URLs from the message
  const urlMatch = message.match(/https?:\/\/[^\s]+/);
  const link = urlMatch ? urlMatch[0] : undefined;
  
  // Map platform code to platform name
  const platform = mapCodeToPlatform(platformCode);
  
  // Calculate dollar amount
  const dollarAmount = calculateDollarAmount(units, unitSize, percentage);
  
  return {
    platform,
    units,
    percentage,
    league,
    link,
    rawMessage: message,
    timestamp: new Date(),
    status: 'pending',
    dollarAmount
  };
}

function mapCodeToPlatform(code: string): BettingPlatform {
  switch (code.toLowerCase()) {
    case 'dk':
      return 'DraftKings';
    case 'fd':
      return 'FanDuel';
    case 'mgm':
      return 'BetMGM';
    case 'czr':
      return 'Caesars';
    default:
      return 'Unknown';
  }
}

function calculateDollarAmount(
  units: number,
  unitSize: number,
  percentage?: number
): number {
  let amount = units * unitSize;
  
  // Apply percentage if specified
  if (percentage !== undefined) {
    amount = amount * (percentage / 100);
  }
  
  // Round to two decimal places
  return Math.round(amount * 100) / 100;
}
