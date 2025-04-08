
import { useState, useEffect } from "react";
import BetHistoryTable from "@/components/BetHistoryTable";
import { loadBetHistory } from "@/utils/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDownUp, Download, Filter, Search, Trash2 } from "lucide-react";
import { BetHistoryItem, BetStatus } from "@/types/bet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { saveBetHistory } from "@/utils/storage";

export default function BetHistory() {
  const [betHistory, setBetHistory] = useState<BetHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<BetHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BetStatus | "all">("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  useEffect(() => {
    // Load bet history on mount
    const history = loadBetHistory();
    setBetHistory(history);
    setFilteredHistory(history);
  }, []);
  
  // Apply filters when search, status, or sort order changes
  useEffect(() => {
    let filtered = [...betHistory];
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(bet => bet.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(bet => 
        bet.rawMessage.toLowerCase().includes(query) ||
        bet.platform.toLowerCase().includes(query) ||
        (bet.league && bet.league.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const comparison = b.timestamp.getTime() - a.timestamp.getTime();
      return sortOrder === "desc" ? comparison : -comparison;
    });
    
    setFilteredHistory(filtered);
  }, [betHistory, searchQuery, statusFilter, sortOrder]);
  
  const clearHistory = () => {
    setBetHistory([]);
    setFilteredHistory([]);
    saveBetHistory([]);
  };
  
  const downloadCSV = () => {
    // Generate CSV content
    const headers = ["Date", "Time", "Platform", "Units", "Amount", "Status", "Message", "League", "Link"];
    const rows = filteredHistory.map(bet => [
      bet.timestamp.toLocaleDateString(),
      bet.timestamp.toLocaleTimeString(),
      bet.platform,
      `${bet.units}u${bet.percentage ? ` ${bet.percentage}%` : ''}`,
      `$${bet.dollarAmount.toFixed(2)}`,
      bet.status,
      `"${bet.rawMessage.replace(/"/g, '""')}"`,
      bet.league || "",
      bet.link || ""
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `bet-history-${new Date().toISOString().slice(0, 10)}.csv`);
    a.click();
  };
  
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "desc" ? "asc" : "desc");
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="bg-card rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Bet History</h2>
          
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 size={16} className="mr-2" />
                  Clear History
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently delete your entire bet history.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearHistory} className="bg-destructive text-destructive-foreground">
                    Clear History
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button variant="outline" size="sm" onClick={downloadCSV}>
              <Download size={16} className="mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages, platforms, leagues..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <div className="w-40">
              <Select 
                value={statusFilter} 
                onValueChange={(value) => setStatusFilter(value as BetStatus | "all")}
              >
                <SelectTrigger className="h-10">
                  <Filter size={16} className="mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="placed">Placed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="ignored">Ignored</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" size="icon" onClick={toggleSortOrder}>
              <ArrowDownUp size={16} className={sortOrder === "desc" ? "" : "rotate-180"} />
            </Button>
          </div>
        </div>
        
        {filteredHistory.length === 0 ? (
          <div className="text-center p-12 border border-dashed rounded-lg">
            <p className="text-muted-foreground">No betting history found.</p>
            {(searchQuery || statusFilter !== "all") && (
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your filters to see more results.
              </p>
            )}
          </div>
        ) : (
          <BetHistoryTable bets={filteredHistory} />
        )}
        
        <div className="mt-4 text-sm text-muted-foreground text-right">
          Showing {filteredHistory.length} of {betHistory.length} entries
        </div>
      </div>
    </div>
  );
}
