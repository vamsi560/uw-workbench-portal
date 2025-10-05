import * as React from 'react';

import {cn} from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'> & { label?: string }>(
  ({ className, label, id, ...props }, ref) => {
    const textareaId = id || React.useId();
    return label ? (
      <div className="relative pt-4">
        <textarea
          id={textareaId}
          placeholder=" "
          className={cn(
            'input-professional peer min-h-[80px]',
            className
          )}
          ref={ref}
          {...props}
        />
        <label
          htmlFor={textareaId}
          className="form-label pointer-events-none absolute left-3 top-2 text-muted-foreground transition-all duration-200 origin-left scale-100 peer-placeholder-shown:top-4 peer-placeholder-shown:left-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:text-primary peer-focus:scale-90"
        >
          {label}
        </label>
      </div>
    ) : (
      <textarea
        id={textareaId}
        className={cn(
          'input-professional min-h-[80px]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};
