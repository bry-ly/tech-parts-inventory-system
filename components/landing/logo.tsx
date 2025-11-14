import { cn } from "@/shared/utils/cn";
import { Cpu } from "lucide-react";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <Cpu className="h-8 w-8 text-primary" strokeWidth={2} />
      </div>
      <span className="text-xl font-bold text-foreground">Tech Parts</span>
    </div>
  );
};

export const LogoIcon = ({ className }: { className?: string }) => {
  return (
    <Cpu className={cn("size-8 text-primary", className)} strokeWidth={2} />
  );
};

export const LogoStroke = ({ className }: { className?: string }) => {
  return (
    <Cpu className={cn("size-8 text-primary", className)} strokeWidth={1.5} />
  );
};
