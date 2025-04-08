
import { Bet, BettingPlatform } from "@/types/bet";

// Updated regular expression to match betting patterns with more bonus formats
const BET_REGEX = /@book-([a-z]+)\s+([\d.]+)u(?:\s+(\d+)%)?(?:\s+([a-z]+))?(?:\s+(?:bonus|use):([a-z0-9_\-+% ]+))?/i;

// Enhanced bonus keywords that might appear in messages
const FREE_BET_KEYWORDS = ['free', 'free bet', 'freebie', 'no sweat', 'risk free'];
const ODDS_BOOST_KEYWORDS = ['boost', 'boosted', 'odds boost', 'profit boost', 'enhanced odds'];
const DEPOSIT_MATCH_KEYWORDS = ['match', 'deposit match', 'deposit bonus'];
const SPECIAL_PROMO_KEYWORDS = ['hr', 'home run', 'td', 'touchdown', 'goal', 'parlay', 'sgp'];

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
  
  // Enhanced bonus extraction with more specific matching
  let bonus = undefined;
  
  // First check for explicit bonus in the regex
  if (match[5]) {
    bonus = match[5].trim().toLowerCase();
  } else {
    // Check for bonus keywords in the full message
    const messageLower = message.toLowerCase();
    
    // Extract percentage if present in the message
    const percentMatch = messageLower.match(/(\d+)%/i);
    const percentValue = percentMatch ? percentMatch[1] : null;
    
    // Look for league-specific bonuses like "20% MLB"
    if (percentValue && league) {
      bonus = `${percentValue}%_${league.toLowerCase()}`;
    }
    // Check for no sweat specific offers
    else if (messageLower.includes('no sweat') && SPECIAL_PROMO_KEYWORDS.some(keyword => messageLower.includes(keyword))) {
      const promoType = SPECIAL_PROMO_KEYWORDS.find(keyword => messageLower.includes(keyword));
      bonus = `no_sweat_${promoType}`;
    }
    // Check for standard free bet keywords
    else if (FREE_BET_KEYWORDS.some(keyword => messageLower.includes(keyword))) {
      bonus = 'free_bet';
    } 
    // Check for odds boost keywords
    else if (ODDS_BOOST_KEYWORDS.some(keyword => messageLower.includes(keyword))) {
      // If there's a percentage with the boost, include it
      if (percentValue) {
        bonus = `${percentValue}%_boost`;
      } else {
        bonus = 'odds_boost';
      }
    } 
    // Check for deposit match keywords
    else if (DEPOSIT_MATCH_KEYWORDS.some(keyword => messageLower.includes(keyword))) {
      // If there's a percentage with the match, include it
      if (percentValue) {
        bonus = `${percentValue}%_deposit_match`;
      } else {
        bonus = 'deposit_match';
      }
    }
    // Check for percentage in the message if not already extracted from the regex and no specific type identified
    else if (percentValue && !bonus) {
      bonus = `${percentValue}%_boost`; // Default to boost if just percentage is mentioned
    }
  }
  
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
    dollarAmount,
    bonus
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
