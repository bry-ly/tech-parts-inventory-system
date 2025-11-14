"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockAlert } from "@/domain/entities/stock-alert.entity";
import { getUserAlerts, acknowledgeAlert } from "@/application/actions/stock-alert.actions";
import { toast } from "sonner";
import { IconAlertTriangle, IconCheck, IconX } from "@tabler/icons-react";

export function StockAlertList() {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAcknowledged, setShowAcknowledged] = useState(false);

  async function loadAlerts() {
    setLoading(true);
    const result = await getUserAlerts(showAcknowledged);
    if (result.error) {
      toast.error(result.error);
    } else {
      setAlerts(result.data || []);
    }
    setLoading(false);
  }

  async function handleAcknowledge(alertId: string) {
    const result = await acknowledgeAlert(alertId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Alert acknowledged");
      loadAlerts();
    }
  }

  useEffect(() => {
    loadAlerts();
  }, [showAcknowledged]);

  const getAlertColor = (type: string) => {
    switch (type) {
      case "OUT_OF_STOCK":
        return "destructive";
      case "LOW_STOCK":
        return "default";
      case "EXPIRING_SOON":
        return "default";
      case "EXPIRED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "OUT_OF_STOCK":
      case "EXPIRED":
        return <IconX size={16} />;
      case "LOW_STOCK":
      case "EXPIRING_SOON":
        return <IconAlertTriangle size={16} />;
      default:
        return <IconAlertTriangle size={16} />;
    }
  };

  if (loading) {
    return <div>Loading alerts...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Stock Alerts</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAcknowledged(!showAcknowledged)}
        >
          {showAcknowledged ? "Hide Acknowledged" : "Show Acknowledged"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {alerts.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No alerts found
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getAlertIcon(alert.type)}</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={getAlertColor(alert.type) as any}>
                        {alert.type.replace("_", " ")}
                      </Badge>
                      {alert.acknowledged && (
                        <Badge variant="outline">Acknowledged</Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {!alert.acknowledged && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAcknowledge(alert.id)}
                  >
                    <IconCheck size={16} />
                    Acknowledge
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}



