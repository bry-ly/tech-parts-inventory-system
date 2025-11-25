"use client";
import { useState, useTransition } from "react";
import { ActivityLogItem } from "./activity-log-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { deleteActivityLogs } from "@/lib/action/activity";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

interface ActivityLogListProps {
  logs: {
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
  }[];
}

export function ActivityLogList({ logs }: ActivityLogListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          No activity logs found.
        </CardContent>
      </Card>
    );
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(logs.map((log) => log.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteActivityLogs(selectedIds);
      if (result.success) {
        toast.success(result.message);
        setSelectedIds([]);
        setIsDialogOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Activity Log</CardTitle>
        {selectedIds.length > 0 && (
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected ({selectedIds.length})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  selected {selectedIds.length} activity log(s).
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete();
                  }}
                  disabled={isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-3 border-b flex items-center gap-3 bg-muted/20">
          <Checkbox
            checked={logs.length > 0 && selectedIds.length === logs.length}
            onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
          />
          <span className="text-sm text-muted-foreground">Select All</span>
        </div>
        <div className="divide-y">
          {logs.map((log) => (
            <ActivityLogItem
              key={log.id}
              log={log}
              selected={selectedIds.includes(log.id)}
              onSelect={(checked) => handleSelectOne(log.id, checked)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
