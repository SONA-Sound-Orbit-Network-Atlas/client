import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      data-slot="input"
      className={cn(
        'w-full p-[13px] h-[46px] bg-[var(--color-navy-opacity-100)] border-solid border-[1px] border-[var(--color-border-white)] rounded-[8px] placeholder:text-[var(--color-text-muted)] text-[14px] text-[var(--color-text-white)] outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        className
      )}
      {...props}
    />
  );
}

export default Input;
