"use client";

import { WorkbenchHeader } from "@/components/workbench/workbench-header";
import { WorkbenchClient } from "@/components/workbench/workbench-client";
import { useWorkItemUpdates } from "@/hooks/use-workitem-updates";

export default function Home() {
  const { connected } = useWorkItemUpdates({
    enableNotifications: false,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <WorkbenchHeader 
        isConnected={connected}
        isConnecting={!connected}
      />
      <div className="container mx-auto p-4 md:p-8">
        <WorkbenchClient />
      </div>
    </div>
  );
}
