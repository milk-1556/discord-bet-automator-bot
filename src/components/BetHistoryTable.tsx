
import { useState } from "react";
import { BetHistoryItem, BetStatus } from "@/types/bet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BetHistoryTableProps {
  bets: BetHistoryItem[];
  className?: string;
}

export default function BetHistoryTable({ bets, className }: BetHistoryTableProps) {
  const [expandedBetId, setExpandedBetId] = useState<string | null>(null);
  
  if (bets.length === 0) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <p className="text-muted-foreground">No betting history available yet.</p>
      </div>
    );
  }
  
  const toggleExpand = (id: string) => {
    setExpandedBetId(expandedBetId === id ? null : id);
  };
  
  return (
    <div className={className}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Units</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Message</TableHead>
            <TableHead className="text-right">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bets.map((bet) => (
            <TableRow key={bet.id} className="group">
              <TableCell className="font-medium">
                {bet.timestamp.toLocaleTimeString()}
              </TableCell>
              <TableCell>{bet.platform}</TableCell>
              <TableCell>{bet.units}u {bet.percentage && `${bet.percentage}%`}</TableCell>
              <TableCell>${bet.dollarAmount.toFixed(2)}</TableCell>
              <TableCell>
                <StatusBadge status={bet.status} />
              </TableCell>
              <TableCell className="max-w-[200px]">
                <div className="truncate" title={bet.rawMessage}>
                  {bet.rawMessage}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpand(bet.id)}
                >
                  <Info size={16} />
                </Button>
              </TableCell>
              {expandedBetId === bet.id && (
                <TableRow>
                  <TableCell colSpan={7} className="bg-secondary/50">
                    <div className="p-4">
                      <h4 className="font-semibold mb-2">Bet Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Raw Message:</p>
                          <p className="text-sm">{bet.rawMessage}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Time:</p>
                          <p className="text-sm">{bet.timestamp.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Link:</p>
                          <p className="text-sm">
                            {bet.link ? (
                              <a href={bet.link} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                                {bet.link}
                              </a>
                            ) : (
                              "None"
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">League:</p>
                          <p className="text-sm">{bet.league || "Not specified"}</p>
                        </div>
                        {bet.errorMessage && (
                          <div className="col-span-2">
                            <p className="text-sm text-muted-foreground">Error:</p>
                            <p className="text-sm text-destructive">{bet.errorMessage}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function StatusBadge({ status }: { status: BetStatus }) {
  // Fix: Changed "success" to "default" for placed status to match valid badge variants
  let variant: "default" | "destructive" | "outline" | "secondary" = "default";
  let label = status;
  
  switch (status) {
    case "placed":
      // Changed from "success" to "default" to fix the type error
      variant = "default";
      break;
    case "failed":
      variant = "destructive";
      break;
    case "pending":
      variant = "outline";
      break;
    case "processing":
      variant = "secondary";
      break;
    case "ignored":
      variant = "outline";
      label = "ignored";
      break;
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={variant} className="capitalize">
            {label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {status === "placed" && "Bet successfully placed"}
            {status === "failed" && "Failed to place bet"}
            {status === "pending" && "Bet detected, waiting to be processed"}
            {status === "processing" && "Currently placing bet"}
            {status === "ignored" && "Bet was ignored"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
