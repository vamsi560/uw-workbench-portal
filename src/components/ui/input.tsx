import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { label?: string }>(
  ({ className, type, label, id, ...props }, ref) => {
    const inputId = id || React.useId();
    return label ? (
      <div className="relative pt-4">
        <input
          id={inputId}
          type={type}
          placeholder=" "
          className={cn(
            "input-professional peer",
            className
          )}
          ref={ref}
          {...props}
        />
        <label
          htmlFor={inputId}
          className="form-label pointer-events-none absolute left-3 top-2 text-muted-foreground transition-all duration-200 origin-left scale-100 peer-placeholder-shown:top-4 peer-placeholder-shown:left-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:text-primary peer-focus:scale-90"
        >
          {label}
        </label>
      </div>
    ) : (
      <input
        id={inputId}
        type={type}
        className={cn(
          "input-professional",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
)
Input.displayName = "Input"

export { Input }
