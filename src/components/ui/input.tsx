import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({
  className,
  type,
  id,
  onChange,
  ...props
}: React.ComponentProps<'input'>) {
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <input
      id={id}
      type={type}
      data-slot="input"
      className={cn(
        'w-full p-[13px] h-[46px] bg-[var(--color-navy-opacity-100)] border-solid border-[1px] border-[var(--color-border-white)] rounded-[8px] placeholder:text-[var(--color-text-muted)] text-[14px] text-[var(--color-text-white)]',
        className
      )}
      onChange={onChangeHandler}
      {...props}
    />
  );
}

export { Input };
