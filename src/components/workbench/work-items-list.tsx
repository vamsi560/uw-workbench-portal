
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkitems } from "@/hooks/use-workitems";

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
    <ul>
      {workItems.map((item) => (
        <li key={item.id}>
          #{item.id} {/* Render other fields as needed */}
        </li>
      ))}
    </ul>
  );
}
