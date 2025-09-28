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
      {(items || []).map((item, idx) => (
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

// Export additional components that professional-header expects
export function BreadcrumbList({ children }: { children: React.ReactNode }) {
  return <ol className="flex items-center gap-2 text-sm">{children}</ol>;
}

export function BreadcrumbItem({ children }: { children: React.ReactNode }) {
  return <li className="flex items-center gap-2">{children}</li>;
}

export function BreadcrumbLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-primary hover:underline font-medium">
      {children}
    </a>
  );
}

export function BreadcrumbPage({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground font-normal">{children}</span>;
}

export function BreadcrumbSeparator() {
  return <ChevronRight className="h-4 w-4 text-muted-foreground" />;
}
