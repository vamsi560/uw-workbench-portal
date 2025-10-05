
import * as React from "react";
import "react";
import { cn } from "@/lib/utils";
import type { ForwardedRef } from "react";
import type * as JSX from "react/jsx-runtime";

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  className?: string;
  children?: React.ReactNode;
}
const Table = React.forwardRef<HTMLTableElement, TableProps>(
  function Table(
    { className, children, ...props }: TableProps,
    ref: ForwardedRef<HTMLTableElement>
  ) {
    return (
      <div className="relative w-full overflow-auto">
        <table
          ref={ref}
          className={cn(
            "w-full caption-bottom text-sm rounded-lg border bg-card text-card-foreground shadow-md transition-all duration-200 border-transparent bg-clip-padding",
            "[&>thead]:sticky [&>thead]:top-0 [&>thead]:z-10 [&>thead]:bg-card/95 backdrop-blur-md",
            className
          )}
          style={{
            borderImage: 'linear-gradient(135deg, #0099A8 0%, #00B4D8 50%, #48CAE4 100%) 1',
            borderWidth: '1px',
          }}
          {...props}
        >
          {/* Ensure at least one header row for accessibility */}
          {children}
        </table>
      </div>
    );
  }
);
Table.displayName = "Table";

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}
const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  function TableHeader(
    { className, ...props }: TableHeaderProps,
    ref: ForwardedRef<HTMLTableSectionElement>
  ) {
    return (
      <thead
        ref={ref}
        className={cn(
          "[&_tr]:border-b [&_th]:sticky [&_th]:top-0 [&_th]:z-10 [&_th]:bg-card/95 backdrop-blur-md",
          className
        )}
        {...props}
      />
    );
  }
);
TableHeader.displayName = "TableHeader";

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}
const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody(
    { className, ...props }: TableBodyProps,
    ref: ForwardedRef<HTMLTableSectionElement>
  ) {
    return (
      <tbody
        ref={ref}
        className={cn(
          "[&_tr:last-child]:border-0 [&>tr:nth-child(even)]:bg-[#eaf6fa]/60 dark:[&>tr:nth-child(even)]:bg-[#1a2a32]/40",
          className
        )}
        {...props}
      />
    );
  }
);
TableBody.displayName = "TableBody";

interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}
const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  function TableFooter(
    { className, ...props }: TableFooterProps,
    ref: ForwardedRef<HTMLTableSectionElement>
  ) {
    return (
      <tfoot
        ref={ref}
        className={cn(
          "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
          className
        )}
        {...props}
      />
    );
  }
);
TableFooter.displayName = "TableFooter";

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string;
}
const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow(
    { className, ...props }: TableRowProps,
    ref: ForwardedRef<HTMLTableRowElement>
  ) {
    return (
      <tr
        ref={ref}
        tabIndex={0}
        className={cn(
          "border-b transition-colors focus:outline-none focus:ring-2 focus:ring-peacock-500 hover:bg-gradient-to-r hover:from-[#0099A8]/10 hover:to-[#48CAE4]/10 data-[state=selected]:bg-peacock-100/60 dark:data-[state=selected]:bg-peacock-900/40 cursor-pointer",
          className
        )}
        {...props}
      />
    );
  }
);
TableRow.displayName = "TableRow";

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  className?: string;
}
const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  function TableHead(
    { className, ...props }: TableHeadProps,
    ref: ForwardedRef<HTMLTableCellElement>
  ) {
    return (
      <th
        ref={ref}
        className={cn(
          "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
          className
        )}
        {...props}
      />
    );
  }
);
TableHead.displayName = "TableHead";

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  className?: string;
}
const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell(
    { className, ...props }: TableCellProps,
    ref: ForwardedRef<HTMLTableCellElement>
  ) {
    return (
      <td
        ref={ref}
        className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
        {...props}
      />
    );
  }
);
TableCell.displayName = "TableCell";

interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
  className?: string;
}
const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  function TableCaption(
    { className, ...props }: TableCaptionProps,
    ref: ForwardedRef<HTMLTableCaptionElement>
  ) {
    return (
      <caption
        ref={ref}
        className={cn("mt-4 text-sm text-muted-foreground", className)}
        {...props}
      />
    );
  }
);
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
