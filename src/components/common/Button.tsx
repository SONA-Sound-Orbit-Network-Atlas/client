import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "py-0 m-[0px] border-solid border-[1px] rounded-[8px] cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive leading-none box-border",
  {
    variants: {
      color: {
        primary:
          'bg-gradient-to-r from-secondary-300 to-primary-300 text-text-white border-secondary-300-20',
        secondary:
          'bg-tertiary-200-10 text-tertiary-200 border-tertiary-200-20',
        tertiary: 'text-text-white border-gray-border bg-gray-card',
      },
      size: {
        lg: 'h-[46px] px-5 font-semibold',
        md: 'h-[40px] px-4',
        sm: 'h-[38px] px-3',
        xs: 'h-[30px] px-2',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
      },
    },
    defaultVariants: {
      color: 'primary',
      size: 'lg',
    },
  }
);

function Button({
  className,
  color,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ color, size, className }))}
      {...props}
    />
  );
}

export default Button;
