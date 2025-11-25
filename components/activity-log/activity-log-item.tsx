import { formatDistanceToNow, format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface ActivityLogItemProps {
  log: {
    id: string;
    action: string;
    entityType: string;
    entityId: string | null;
    changes: unknown;
    note: string | null;
    createdAt: Date;
    actor: {
      name: string | null;
      email: string | null;
      image: string | null;
    } | null;
  };
  selected?: boolean;
  onSelect?: (checked: boolean) => void;
}

export function ActivityLogItem({
  log,
  selected,
  onSelect,
}: ActivityLogItemProps) {
  const getActionBadge = () => {
    switch (log.action) {
      case "CREATE":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Created</Badge>
        );
      case "UPDATE":
        return (
          <Badge
            variant="secondary"
            className="text-blue-500 bg-blue-50 hover:bg-blue-100"
          >
            Updated
          </Badge>
        );
      case "DELETE":
        return <Badge variant="destructive">Deleted</Badge>;
      default:
        return <Badge variant="outline">{log.action}</Badge>;
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 border-b last:border-0 hover:bg-muted/50 transition-colors">
      <div className="flex items-center h-8">
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => onSelect?.(checked as boolean)}
        />
      </div>
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={log.actor?.image || ""}
          alt={log.actor?.name || "User"}
        />
        <AvatarFallback>{log.actor?.name?.[0] || "U"}</AvatarFallback>
      </Avatar>
      <div className="flex-1  space-y-2 space-x-2">
        <div className="flex items-center gap-2 flex-wrap">
          {getActionBadge()}
          <span className="font-medium text-sm">
            {log.actor?.name || "Unknown User"}
          </span>
          <span className="text-muted-foreground text-sm">
            performed action on
          </span>
          <span className="font-medium text-sm">{log.entityType}</span>
          <div className="ml-auto text-xs text-muted-foreground flex items-center gap-2">
            <span>
              {formatDistanceToNow(new Date(log.createdAt), {
                addSuffix: true,
              })}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">
              {format(new Date(log.createdAt), "PPP p")}
            </span>
          </div>
        </div>
        {log.note && (
          <p className="text-sm text-muted-foreground">{log.note}</p>
        )}
      </div>
    </div>
  );
}
