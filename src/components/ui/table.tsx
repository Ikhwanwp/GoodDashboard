import * as React from "react"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => {
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const [showIndicator, setShowIndicator] = React.useState(false);

  // Use a ResizeObserver to detect changes in the container or table size
  React.useEffect(() => {
    const el = tableContainerRef.current;

    const checkScroll = () => {
      if (el) {
        const hasOverflow = el.scrollWidth > el.clientWidth;
        const isScrolledToEnd = Math.abs(el.scrollWidth - el.scrollLeft - el.clientWidth) < 1;
        setShowIndicator(hasOverflow && !isScrolledToEnd);
      }
    };
    
    if (!el) return;

    // Check on mount and on scroll
    checkScroll();
    el.addEventListener('scroll', checkScroll);

    // Use ResizeObserver to automatically check when size changes
    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(el);
    
    // Also observe the table itself if it's a child
    const tableEl = el.querySelector('table');
    if (tableEl) {
      resizeObserver.observe(tableEl);
    }


    return () => {
      el.removeEventListener('scroll', checkScroll);
      resizeObserver.disconnect();
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  return (
    <div className="relative w-full">
      <div ref={tableContainerRef} className="overflow-auto">
        <table
          ref={ref}
          className={cn("w-full caption-bottom text-xs md:text-sm", className)}
          {...props}
        />
      </div>
      {showIndicator && (
        <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-background via-background/80 to-transparent flex items-center justify-end pointer-events-none">
            <ChevronRight className="h-6 w-6 text-primary animate-pulse-horizontal" />
        </div>
      )}
    </div>
  )
})
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

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
