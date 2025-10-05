

import { Skeleton } from "@/components/ui/skeleton";
import { useWorkitems } from "@/hooks/use-workitems";
import { Card, CardContent } from "@/components/ui/card";

export function WorkItemsList() {
  const { workItems, loading } = useWorkitems(60000); // 60s polling

  if (loading) {
    return (
      <ul className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i}>
            <Skeleton className="h-6 w-1/2" />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {workItems.map((item) => (
        <Card key={item.id} variant="gradient" className="p-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold">Work Item #{item.id}</span>
              <span className="text-xs bg-white/20 rounded-full px-3 py-1 font-semibold uppercase tracking-wide" style={{letterSpacing:2}}>{item.status || 'Pending'}</span>
            </div>
            <div className="text-sm mb-1"><span className="font-medium">Subject:</span> {item.subject || 'N/A'}</div>
            <div className="text-sm mb-1"><span className="font-medium">Owner:</span> {item.owner || 'Unassigned'}</div>
            <div className="text-xs opacity-80">Created: {item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
