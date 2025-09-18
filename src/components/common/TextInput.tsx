import * as React from 'react';

import { mergeClassNames } from '@/utils/mergeClassNames';

function TextInput({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      data-slot="input"
      className={mergeClassNames(
        'w-full p-[13px] h-[46px] bg-gray-card border-solid border-[1px] border-gray-border rounded-[8px] placeholder:text-text-muted text-[14px] text-text-white outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        className
      )}
      {...props}
    />
  );
}

export default TextInput;
