import * as React from 'react';

import { mergeClassNames } from '@/utils/mergeClassNames';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={mergeClassNames(
        'w-full p-[13px] min-h-[86px] bg-gray-card border-solid border-[1px] border-gray-border rounded-[8px] placeholder:text-text-muted text-[14px] text-text-white resize-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        className
      )}
      {...props}
    />
  );
}

export default Textarea;
