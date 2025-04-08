
import { Settings, LayoutDashboard, PauseOctagon, Bot } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="flex items-center justify-between p-4 border-b border-border">
      <div className="flex items-center gap-2">
        <Bot size={24} className="text-primary" />
        <h1 className="text-xl font-bold">Discord Bet Automator</h1>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant={isActive("/") ? "default" : "ghost"}
          size="sm"
          onClick={() => navigate("/")}
          className={cn("gap-2", isActive("/") && "bg-primary")}
        >
          <LayoutDashboard size={16} />
          Dashboard
        </Button>
        
        <Button
          variant={isActive("/logs") ? "default" : "ghost"}
          size="sm"
          onClick={() => navigate("/logs")}
          className={cn("gap-2", isActive("/logs") && "bg-primary")}
        >
          <PauseOctagon size={16} />
          Bet History
        </Button>
        
        <Button
          variant={isActive("/settings") ? "default" : "ghost"}
          size="sm"
          onClick={() => navigate("/settings")}
          className={cn("gap-2", isActive("/settings") && "bg-primary")}
        >
          <Settings size={16} />
          Settings
        </Button>
      </div>
    </header>
  );
}
