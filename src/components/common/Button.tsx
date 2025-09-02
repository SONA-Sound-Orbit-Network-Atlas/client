import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClassNames } from '@/utils/mergeClassNames';

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
        transparent: 'text-text-muted border-none bg-transparent',
      },
      size: {
        lg: 'h-[46px] px-5 font-semibold',
        md: 'h-[40px] px-4',
        sm: 'h-[38px] px-3',
        xs: 'h-[30px] px-2',
      },
      textAlign: {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
      },
      iconOnly: {
        true: 'gap-0', // 아이콘만 있을 때는 gap 제거
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
      },
    },
    compoundVariants: [
      // iconOnly가 true일 때 각 사이즈별로 width = height로 설정
      { iconOnly: true, size: 'lg', class: 'w-[46px] px-0' },
      { iconOnly: true, size: 'md', class: 'w-[40px] px-0' },
      { iconOnly: true, size: 'sm', class: 'w-[38px] px-0' },
      { iconOnly: true, size: 'xs', class: 'w-[30px] px-0' },
    ],
    defaultVariants: {
      color: 'primary',
      size: 'lg',
      textAlign: 'center',
    },
  }
);

function Button({
  className,
  color,
  size,
  textAlign,
  iconOnly = false,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    textAlign?: 'left' | 'center' | 'right';
    iconOnly?: boolean;
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={mergeClassNames(
        buttonVariants({ color, size, iconOnly, textAlign, className })
      )}
      {...props}
    />
  );
}

export default Button;
