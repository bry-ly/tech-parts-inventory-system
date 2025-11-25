import { Badge } from "@/components/ui/badge";
import { IconX } from "@tabler/icons-react";

interface TagBadgeProps {
  name: string;
  onRemove?: () => void;
  variant?: "default" | "secondary" | "outline" | "destructive";
}

export function TagBadge({
  name,
  onRemove,
  variant = "secondary",
}: TagBadgeProps) {
  return (
    <Badge variant={variant} className="gap-1">
      {name}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 hover:text-destructive"
        >
          <IconX className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
}
