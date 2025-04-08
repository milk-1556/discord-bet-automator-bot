
import { Check, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  status: "online" | "offline" | "warning" | "error";
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function StatusCard({
  title,
  status,
  description,
  icon,
  className
}: StatusCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <StatusIndicator status={status} />
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {icon}
      </CardContent>
    </Card>
  );
}

function StatusIndicator({ status }: { status: "online" | "offline" | "warning" | "error" }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium capitalize">{status}</span>
      {status === "online" && (
        <div className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-green-500 animate-pulse-slow">
          <Check size={10} className="text-white" />
        </div>
      )}
      {status === "offline" && (
        <div className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-slate-400">
          <div className="h-1.5 w-1.5 rounded-full bg-slate-600" />
        </div>
      )}
      {status === "warning" && (
        <div className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-yellow-500">
          <AlertCircle size={10} className="text-white" />
        </div>
      )}
      {status === "error" && (
        <div className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500">
          <XCircle size={10} className="text-white" />
        </div>
      )}
    </div>
  );
}
