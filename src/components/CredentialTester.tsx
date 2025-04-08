
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { BettingPlatform } from "@/types/bet";
import { backendService } from "@/services/BackendService";
import { loadConfig } from "@/utils/storage";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CredentialTesterProps {
  platform: BettingPlatform;
}

export default function CredentialTester({ platform }: CredentialTesterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showBonusInput, setShowBonusInput] = useState(false);
  const [bonusCode, setBonusCode] = useState("");
  const [availableBonuses, setAvailableBonuses] = useState<string[]>([]);
  const [isLoadingBonuses, setIsLoadingBonuses] = useState(false);
  const { toast } = useToast();

  // Fetch available bonuses when component mounts or when platform changes
  useEffect(() => {
    if (showBonusInput) {
      fetchAvailableBonuses();
    }
  }, [platform, showBonusInput]);

  const fetchAvailableBonuses = async () => {
    setIsLoadingBonuses(true);
    try {
      const config = loadConfig();
      const bonuses = await backendService.getAvailableBonuses(platform, config);
      setAvailableBonuses(bonuses);
    } catch (error) {
      console.error("Failed to fetch bonuses:", error);
    } finally {
      setIsLoadingBonuses(false);
    }
  };

  const testCredentials = async () => {
    setIsLoading(true);
    const config = loadConfig();
    
    try {
      const success = await backendService.testBetPlacement(platform, config, bonusCode || undefined);
      
      if (success) {
        toast({
          title: "Credentials valid",
          description: `${platform} credentials were verified successfully${bonusCode ? ` with bonus: ${bonusCode}` : ''}.`,
        });
      } else {
        toast({
          title: "Credentials invalid",
          description: `Could not verify ${platform} credentials. Please check username and password.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Test failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={testCredentials}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            "Test Credentials"
          )}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowBonusInput(!showBonusInput)}
        >
          {showBonusInput ? "Hide Bonus" : "Add Bonus"}
        </Button>
      </div>
      
      {showBonusInput && (
        <div className="space-y-1">
          <Label htmlFor={`${platform.toLowerCase()}-bonus`} className="text-xs">Bonus Selection</Label>
          
          {isLoadingBonuses ? (
            <div className="flex items-center text-xs text-muted-foreground">
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Loading bonuses...
            </div>
          ) : availableBonuses.length > 0 ? (
            <Select 
              value={bonusCode} 
              onValueChange={setBonusCode}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select bonus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No bonus</SelectItem>
                {availableBonuses.map(bonus => (
                  <SelectItem key={bonus} value={bonus}>
                    {bonus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                id={`${platform.toLowerCase()}-bonus`}
                placeholder="Enter bonus code"
                value={bonusCode}
                onChange={(e) => setBonusCode(e.target.value)}
                className="h-8 text-sm"
              />
              <Button 
                size="sm" 
                variant="outline" 
                onClick={fetchAvailableBonuses}
                className="h-8 text-xs"
              >
                Refresh
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
