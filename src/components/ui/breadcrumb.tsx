import * as React from "react";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm gap-2">
      {items.map((item, idx) => (
        <React.Fragment key={item.label + idx}>
          {idx > 0 && (
            <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
          )}
          {item.href ? (
            <a
              href={item.href}
              className="text-primary hover:underline font-medium"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-muted-foreground font-normal">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
