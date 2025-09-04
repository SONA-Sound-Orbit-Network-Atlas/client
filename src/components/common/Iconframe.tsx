import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { mergeClassNames } from '@/utils/mergeClassNames';

const iconframeVariants = cva(
  'inline-flex items-center justify-center rounded-[8px] border-solid border-[1px] transition-all',
  {
    variants: {
      color: {
        primary:
          'bg-gradient-to-br from-primary-300/30 to-secondary-300/30 border-primary-300-30 text-primary-300',
        secondary:
          'bg-gradient-to-br from-secondary-300/30 to-secondary-300/30 border-secondary-300-30 text-secondary-300',
        tertiary:
          'bg-gradient-to-br from-tertiary-200/30 to-tertiary-200/20 border-tertiary-200-30 text-tertiary-200',
      },
      size: {
        small: 'w-[48px] h-[48px] [&_svg]:w-4 [&_svg]:h-4',
        medium: 'w-[64px] h-[64px] [&_svg]:w-5 [&_svg]:h-5',
        large: 'w-[80px] h-[80px] [&_svg]:w-6 [&_svg]:h-6',
      },
    },
    defaultVariants: {
      color: 'primary',
      size: 'medium',
    },
  }
);

export interface IconframeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof iconframeVariants> {
  children: React.ReactNode;
}

function Iconframe({
  className,
  color,
  size,
  children,
  ...props
}: IconframeProps) {
  return (
    <div
      className={mergeClassNames(iconframeVariants({ color, size, className }))}
      {...props}
    >
      {children}
    </div>
  );
}

export default Iconframe;
