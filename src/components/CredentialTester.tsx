
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { BettingPlatform } from "@/types/bet";
import { backendService } from "@/services/BackendService";
import { loadConfig } from "@/utils/storage";
import { useToast } from "@/components/ui/use-toast";

interface CredentialTesterProps {
  platform: BettingPlatform;
}

export default function CredentialTester({ platform }: CredentialTesterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const testCredentials = async () => {
    setIsLoading(true);
    const config = loadConfig();
    
    try {
      const success = await backendService.testBetPlacement(platform, config);
      
      if (success) {
        toast({
          title: "Credentials valid",
          description: `${platform} credentials were verified successfully.`,
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
  );
}
